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
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Insights</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {/* Weekly Stats */}
        <Text className="text-lg font-semibold text-gray-900 mb-4">
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
              <Text className="text-gray-500 text-sm mt-1">Adherence</Text>
            </View>
          </Card>
          <Card className="flex-1">
            <View className="items-center">
              <Text className="text-3xl font-bold text-gray-900">
                {weekStats?.totalDoses || 0}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">Total Doses</Text>
            </View>
          </Card>
        </View>

        {/* Monthly Stats */}
        <Text className="text-lg font-semibold text-gray-900 mb-4">
          This Month
        </Text>
        <Card className="mb-6">
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-green-600">
                {monthStats?.takenDoses || 0}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">Taken</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-red-500">
                {monthStats?.missedDoses || 0}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">Missed</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-yellow-500">
                {monthStats?.skippedDoses || 0}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">Skipped</Text>
            </View>
          </View>
        </Card>

        {/* Coming Soon Section */}
        <Card>
          <View className="items-center py-6">
            <View className="w-16 h-16 rounded-full bg-primary-100 items-center justify-center mb-4">
              <Ionicons name="sparkles" size={32} color="#BE3455" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">
              AI Insights Coming Soon
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center px-4">
              We're working on AI-powered insights to help you optimize your
              protocols and track your progress more effectively.
            </Text>
          </View>
        </Card>

        {/* Tip Card */}
        <Card className="mt-6 bg-primary-50">
          <View className="flex-row">
            <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center">
              <Ionicons name="bulb" size={20} color="#BE3455" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-primary-900">
                Quick Tip
              </Text>
              <Text className="text-primary-700 text-sm mt-1">
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
