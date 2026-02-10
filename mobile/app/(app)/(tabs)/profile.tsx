import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../../src/contexts/AuthContext";
import { Card } from "../../../src/components/ui";

export default function ProfileScreen() {
  const { patient, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const menuItems = [
    {
      icon: "flask-outline" as const,
      label: "My Vials",
      onPress: () => router.push("/vials"),
    },
    {
      icon: "person-outline" as const,
      label: "Edit Profile",
      onPress: () => {},
    },
    {
      icon: "notifications-outline" as const,
      label: "Notifications",
      onPress: () => {},
    },
    {
      icon: "shield-outline" as const,
      label: "Privacy & Security",
      onPress: () => {},
    },
    {
      icon: "help-circle-outline" as const,
      label: "Help & Support",
      onPress: () => {},
    },
    {
      icon: "document-text-outline" as const,
      label: "Terms of Service",
      onPress: () => {},
    },
    {
      icon: "information-circle-outline" as const,
      label: "About",
      onPress: () => {},
    },
  ];

  const displayName =
    patient?.firstName && patient?.lastName
      ? `${patient.firstName} ${patient.lastName}`
      : patient?.firstName || patient?.email || "User";

  const initials =
    patient?.firstName && patient?.lastName
      ? `${patient.firstName[0]}${patient.lastName[0]}`
      : patient?.firstName?.[0] || patient?.email?.[0]?.toUpperCase() || "U";

  return (
    <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Profile Header */}
        <Card className="mb-6">
          <View className="items-center py-4">
            <View className="w-20 h-20 rounded-full bg-primary-500/20 items-center justify-center">
              <Text className="text-2xl font-bold text-primary-500">
                {initials}
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-100 mt-4">
              {displayName}
            </Text>
            <Text className="text-gray-400 mt-1">{patient?.email}</Text>

            {/* Account Type Badge */}
            <View className="mt-4 bg-primary-500/20 px-4 py-1 rounded-full">
              <Text className="text-primary-400 font-medium text-sm capitalize">
                {patient?.accountType || "Free"} Account
              </Text>
            </View>
          </View>
        </Card>

        {/* Menu Items */}
        <Card className="mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              className={`flex-row items-center py-4 ${
                index !== menuItems.length - 1
                  ? "border-b border-surface-border"
                  : ""
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-surface-elevated items-center justify-center">
                <Ionicons name={item.icon} size={20} color="#9CA3AF" />
              </View>
              <Text className="flex-1 ml-3 text-gray-100 font-medium">
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-900/30 rounded-xl py-4 flex-row items-center justify-center border border-red-800"
        >
          <Ionicons name="log-out-outline" size={20} color="#F87171" />
          <Text className="text-red-400 font-semibold ml-2">Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text className="text-center text-gray-500 text-sm mt-8">
          BioStak v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
