import React from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/contexts/AuthContext";
import { useProtocols, useDoseStats, useDosesToday } from "../../src/hooks";
import { Card, Badge } from "../../src/components/ui";

export default function DashboardScreen() {
  const { patient } = useAuth();
  const router = useRouter();
  const {
    data: protocols,
    isLoading: protocolsLoading,
    refetch: refetchProtocols,
  } = useProtocols();
  const { data: stats, refetch: refetchStats } = useDoseStats("week");
  const { data: todayDoses, refetch: refetchToday } = useDosesToday();

  const isLoading = protocolsLoading;
  const activeProtocols = protocols?.filter((p) => p.status === "active") || [];
  const pausedProtocols = protocols?.filter((p) => p.status === "paused") || [];

  const onRefresh = async () => {
    await Promise.all([refetchProtocols(), refetchStats(), refetchToday()]);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "active";
      case "paused":
        return "paused";
      case "completed":
        return "completed";
      default:
        return "default";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor="#BE3455"
          />
        }
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {patient?.firstName || "there"}
          </Text>
          <Text className="text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="px-5 mb-6">
          <View className="flex-row gap-3">
            <Card className="flex-1">
              <Text className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                Today
              </Text>
              <Text className="text-3xl font-bold text-gray-900 mt-1">
                {todayDoses?.length || 0}
              </Text>
              <Text className="text-gray-500 text-sm">doses logged</Text>
            </Card>
            <Card className="flex-1">
              <Text className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                This Week
              </Text>
              <Text className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.adherenceRate ? `${Math.round(stats.adherenceRate)}%` : "—"}
              </Text>
              <Text className="text-gray-500 text-sm">adherence</Text>
            </Card>
          </View>
        </View>

        {/* Quick Log Button */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            className="bg-primary-500 rounded-xl py-4 flex-row items-center justify-center"
            onPress={() => router.push("/(app)/log")}
          >
            <Ionicons name="add-circle" size={24} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Log a Dose
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Protocols */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Active Protocols
            </Text>
            {activeProtocols.length > 0 && (
              <TouchableOpacity>
                <Text className="text-primary-500 font-medium">See All</Text>
              </TouchableOpacity>
            )}
          </View>

          {isLoading ? (
            <View className="py-8 items-center">
              <ActivityIndicator color="#BE3455" />
            </View>
          ) : activeProtocols.length === 0 ? (
            <Card>
              <View className="items-center py-6">
                <Ionicons name="flask-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-600 mt-4 text-center">
                  No active protocols yet
                </Text>
                <Text className="text-gray-400 text-sm mt-1 text-center">
                  Create your first protocol to start tracking
                </Text>
                <TouchableOpacity
                  className="mt-4 bg-primary-500 px-6 py-2 rounded-lg"
                  onPress={() => {
                    // Navigate to create protocol
                  }}
                >
                  <Text className="text-white font-medium">Add Protocol</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ) : (
            activeProtocols.map((protocol) => (
              <TouchableOpacity
                key={protocol.id}
                className="mb-3"
                onPress={() => router.push(`/(app)/protocol/${protocol.id}`)}
              >
                <Card>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="font-semibold text-gray-900">
                          {protocol.template?.name || "Custom Protocol"}
                        </Text>
                        <Badge variant={getStatusVariant(protocol.status)}>
                          {protocol.status}
                        </Badge>
                      </View>
                      <Text className="text-gray-500 text-sm mt-1">
                        {protocol.substances.length} substance
                        {protocol.substances.length !== 1 ? "s" : ""}
                      </Text>
                      {protocol.substances.slice(0, 2).map((ps) => (
                        <Text
                          key={ps.id}
                          className="text-gray-600 text-sm mt-1"
                        >
                          • {ps.substance.name} — {ps.dose} {ps.doseUnit || ""}
                        </Text>
                      ))}
                      {protocol.substances.length > 2 && (
                        <Text className="text-gray-400 text-sm mt-1">
                          +{protocol.substances.length - 2} more
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Paused Protocols */}
        {pausedProtocols.length > 0 && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Paused Protocols
            </Text>
            {pausedProtocols.map((protocol) => (
              <TouchableOpacity
                key={protocol.id}
                className="mb-3 opacity-70"
                onPress={() => router.push(`/(app)/protocol/${protocol.id}`)}
              >
                <Card>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="font-semibold text-gray-900">
                          {protocol.template?.name || "Custom Protocol"}
                        </Text>
                        <Badge variant={getStatusVariant(protocol.status)}>
                          {protocol.status}
                        </Badge>
                      </View>
                      <Text className="text-gray-500 text-sm mt-1">
                        {protocol.substances.length} substance
                        {protocol.substances.length !== 1 ? "s" : ""}
                      </Text>
                      {protocol.substances.slice(0, 2).map((ps) => (
                        <Text
                          key={ps.id}
                          className="text-gray-600 text-sm mt-1"
                        >
                          • {ps.substance.name} — {ps.dose} {ps.doseUnit || ""}
                        </Text>
                      ))}
                      {protocol.substances.length > 2 && (
                        <Text className="text-gray-400 text-sm mt-1">
                          +{protocol.substances.length - 2} more
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Today's Doses */}
        {todayDoses && todayDoses.length > 0 && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Today's Doses
            </Text>
            {todayDoses.map((dose) => (
              <Card key={dose.id} className="mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color="#22C55E"
                    />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-gray-900">
                      {dose.substance.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {dose.dose} {dose.doseUnit || ""} •{" "}
                      {new Date(dose.loggedAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
