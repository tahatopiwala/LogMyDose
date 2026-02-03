import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../src/components/ui";
import { useDoseStats } from "../../src/hooks";

export default function InsightsScreen() {
  const { data: weekStats } = useDoseStats("week");
  const { data: monthStats } = useDoseStats("month");

  return (
    <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 bg-surface-card border-b border-surface-border">
        <Text className="text-2xl font-bold text-gray-100">Insights</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Weekly Stats */}
        <Text className="text-lg font-semibold text-gray-100 mb-4">
          This Week
        </Text>
        <View className="flex-row gap-3 mb-6">
          <Card className="flex-1">
            <View className="items-center">
              <Text className="text-3xl font-bold text-primary-500">
                {weekStats?.adherenceRate
                  ? `${Math.round(weekStats.adherenceRate)}%`
                  : "—"}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Adherence</Text>
            </View>
          </Card>
          <Card className="flex-1">
            <View className="items-center">
              <Text className="text-3xl font-bold text-gray-100">
                {weekStats?.totalDoses || 0}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Total Doses</Text>
            </View>
          </Card>
        </View>

        {/* Monthly Stats */}
        <Text className="text-lg font-semibold text-gray-100 mb-4">
          This Month
        </Text>
        <Card className="mb-6">
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-green-400">
                {monthStats?.takenDoses || 0}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Taken</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-red-400">
                {monthStats?.missedDoses || 0}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Missed</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-amber-400">
                {monthStats?.skippedDoses || 0}
              </Text>
              <Text className="text-gray-400 text-sm mt-1">Skipped</Text>
            </View>
          </View>
        </Card>

        {/* Coming Soon Section */}
        <Card>
          <View className="items-center py-6">
            <View className="w-16 h-16 rounded-full bg-primary-500/20 items-center justify-center mb-4">
              <Ionicons name="sparkles" size={32} color="#39FF14" />
            </View>
            <Text className="text-lg font-semibold text-gray-100">
              AI Insights Coming Soon
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center px-4">
              We're working on AI-powered insights to help you optimize your
              protocols and track your progress more effectively.
            </Text>
          </View>
        </Card>

        {/* Tip Card */}
        <Card className="mt-6 bg-primary-500/10 border-primary-500/30">
          <View className="flex-row">
            <View className="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center">
              <Ionicons name="bulb" size={20} color="#39FF14" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-primary-400">
                Quick Tip
              </Text>
              <Text className="text-primary-300 text-sm mt-1">
                Consistent logging helps build better habits. Try to log your
                doses at the same time each day.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
