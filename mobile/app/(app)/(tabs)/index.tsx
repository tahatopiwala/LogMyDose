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
import { useAuth } from "../../../src/contexts/AuthContext";
import {
  useProtocols,
  useDoseStats,
  useDosesToday,
  useDoses,
} from "../../../src/hooks";
import { Card, Badge } from "../../../src/components/ui";
import { Protocol, Dose } from "../../../src/types/domain";

function estimateNextDose(lastDoseDate: Date, frequency: string): Date | null {
  const freq = frequency.toLowerCase();
  const nextDate = new Date(lastDoseDate);

  if (freq.includes("daily") || freq.includes("qd")) {
    nextDate.setDate(nextDate.getDate() + 1);
  } else if (freq.includes("twice") || freq.includes("bid")) {
    nextDate.setHours(nextDate.getHours() + 12);
  } else if (freq.includes("weekly")) {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (freq.includes("every_other_day")) {
    nextDate.setDate(nextDate.getDate() + 2);
  } else {
    return null;
  }

  return nextDate;
}

function formatTimeUntil(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 48) {
    const days = Math.floor(diffHours / 24);
    return `in ${days} day${days > 1 ? "s" : ""}`;
  }
  if (diffHours > 24) return "tomorrow";
  if (diffHours > 0) return `in ${diffHours}h ${diffMins}m`;
  if (diffMins > 0) return `in ${diffMins}m`;
  return "due now";
}

function computeNextDose(
  protocols: Protocol[],
  allDoses: Dose[],
): { substanceName: string; timeLabel: string } | null {
  const now = new Date();
  const activeProtocols = protocols.filter((p) => p.status === "active");

  let earliestFuture: { substanceName: string; dueTime: Date } | null = null;

  for (const protocol of activeProtocols) {
    for (const ps of protocol.substances) {
      if (!ps.frequency) continue;

      const substanceDoses = allDoses
        .filter((d) => d.substanceId === ps.substanceId && d.status === "taken")
        .sort(
          (a, b) =>
            new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime(),
        );

      if (substanceDoses.length === 0) {
        return { substanceName: ps.substance.name, timeLabel: "due now" };
      }

      const lastDose = substanceDoses[0];
      const nextTime = estimateNextDose(
        new Date(lastDose.loggedAt),
        ps.frequency,
      );

      if (nextTime) {
        if (nextTime <= now) {
          return { substanceName: ps.substance.name, timeLabel: "due now" };
        }
        if (!earliestFuture || nextTime < earliestFuture.dueTime) {
          earliestFuture = {
            substanceName: ps.substance.name,
            dueTime: nextTime,
          };
        }
      }
    }
  }

  if (earliestFuture) {
    return {
      substanceName: earliestFuture.substanceName,
      timeLabel: formatTimeUntil(earliestFuture.dueTime),
    };
  }

  return null;
}

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
  const { data: allDosesData, refetch: refetchDoses } = useDoses({
    limit: 100,
  });

  const isLoading = protocolsLoading;
  const activeProtocols = protocols?.filter((p) => p.status === "active") || [];
  const pausedProtocols = protocols?.filter((p) => p.status === "paused") || [];

  const allDoses = allDosesData?.data || [];
  const nextDoseInfo = computeNextDose(protocols || [], allDoses);

  const onRefresh = async () => {
    await Promise.all([
      refetchProtocols(),
      refetchStats(),
      refetchToday(),
      refetchDoses(),
    ]);
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
    <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor="#39FF14"
          />
        }
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-6">
          <Text className="text-2xl font-bold text-gray-100">
            {getGreeting()}, {patient?.firstName || "there"}
          </Text>
          <Text className="text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        {/* Next Dose Banner */}
        {nextDoseInfo && (
          <View className="px-5 mb-4">
            <TouchableOpacity
              className={`rounded-xl p-4 flex-row items-center ${
                nextDoseInfo.timeLabel === "due now"
                  ? "bg-amber-900/30 border border-amber-800"
                  : "bg-purple-900/30 border border-purple-800"
              }`}
              onPress={() => router.push("/(app)/log")}
            >
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  nextDoseInfo.timeLabel === "due now"
                    ? "bg-amber-500/20"
                    : "bg-purple-500/20"
                }`}
              >
                <Ionicons
                  name={
                    nextDoseInfo.timeLabel === "due now"
                      ? "alert-circle"
                      : "time-outline"
                  }
                  size={24}
                  color={
                    nextDoseInfo.timeLabel === "due now" ? "#FBBF24" : "#A78BFA"
                  }
                />
              </View>
              <View className="ml-3 flex-1">
                <Text
                  className={`font-semibold ${
                    nextDoseInfo.timeLabel === "due now"
                      ? "text-amber-300"
                      : "text-purple-300"
                  }`}
                >
                  {nextDoseInfo.timeLabel === "due now"
                    ? "Dose Due Now"
                    : `Next dose ${nextDoseInfo.timeLabel}`}
                </Text>
                <Text
                  className={`text-sm ${
                    nextDoseInfo.timeLabel === "due now"
                      ? "text-amber-400"
                      : "text-purple-400"
                  }`}
                >
                  {nextDoseInfo.substanceName}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}

        {/* Quick Stats */}
        <View className="px-5 mb-6">
          <View className="flex-row gap-3">
            <Card className="flex-1">
              <Text className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                Today
              </Text>
              <Text className="text-3xl font-bold text-gray-100 mt-1">
                {todayDoses?.length || 0}
              </Text>
              <Text className="text-gray-400 text-sm">doses logged</Text>
            </Card>
            <Card className="flex-1">
              <Text className="text-gray-400 text-xs font-medium uppercase tracking-wide">
                This Week
              </Text>
              <Text className="text-3xl font-bold text-gray-100 mt-1">
                {stats?.adherenceRate
                  ? `${Math.round(stats.adherenceRate)}%`
                  : "—"}
              </Text>
              <Text className="text-gray-400 text-sm">adherence</Text>
            </Card>
          </View>
        </View>

        {/* Quick Log Button */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            className="bg-primary-500 rounded-xl py-4 flex-row items-center justify-center"
            onPress={() => router.push("/(app)/log")}
          >
            <Ionicons name="add-circle" size={24} color="#0D0D0D" />
            <Text className="text-surface-base font-semibold text-lg ml-2">
              Log a Dose
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Protocols */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-100">
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
              <ActivityIndicator color="#39FF14" />
            </View>
          ) : activeProtocols.length === 0 ? (
            <Card>
              <View className="items-center py-6">
                <Ionicons name="flask-outline" size={48} color="#6B7280" />
                <Text className="text-gray-300 mt-4 text-center">
                  No active protocols yet
                </Text>
                <Text className="text-gray-500 text-sm mt-1 text-center">
                  Create your first protocol to start tracking
                </Text>
                <TouchableOpacity
                  className="mt-4 bg-primary-500 px-6 py-2 rounded-lg"
                  onPress={() => {
                    // Navigate to create protocol
                  }}
                >
                  <Text className="text-surface-base font-medium">
                    Add Protocol
                  </Text>
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
                        <Text className="font-semibold text-gray-100">
                          {protocol.name ||
                            protocol.template?.name ||
                            "Custom Protocol"}
                        </Text>
                        <Badge variant={getStatusVariant(protocol.status)}>
                          {protocol.status}
                        </Badge>
                      </View>
                      <Text className="text-gray-400 text-sm mt-1">
                        {protocol.substances.length} substance
                        {protocol.substances.length !== 1 ? "s" : ""}
                      </Text>
                      {protocol.substances.slice(0, 2).map((ps) => (
                        <Text
                          key={ps.id}
                          className="text-gray-400 text-sm mt-1"
                        >
                          • {ps.substance.name} — {ps.dose} {ps.doseUnit || ""}
                        </Text>
                      ))}
                      {protocol.substances.length > 2 && (
                        <Text className="text-gray-500 text-sm mt-1">
                          +{protocol.substances.length - 2} more
                        </Text>
                      )}
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#6B7280"
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Paused Protocols */}
        {pausedProtocols.length > 0 && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-100 mb-4">
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
                        <Text className="font-semibold text-gray-100">
                          {protocol.name ||
                            protocol.template?.name ||
                            "Custom Protocol"}
                        </Text>
                        <Badge variant={getStatusVariant(protocol.status)}>
                          {protocol.status}
                        </Badge>
                      </View>
                      <Text className="text-gray-400 text-sm mt-1">
                        {protocol.substances.length} substance
                        {protocol.substances.length !== 1 ? "s" : ""}
                      </Text>
                      {protocol.substances.slice(0, 2).map((ps) => (
                        <Text
                          key={ps.id}
                          className="text-gray-400 text-sm mt-1"
                        >
                          • {ps.substance.name} — {ps.dose} {ps.doseUnit || ""}
                        </Text>
                      ))}
                      {protocol.substances.length > 2 && (
                        <Text className="text-gray-500 text-sm mt-1">
                          +{protocol.substances.length - 2} more
                        </Text>
                      )}
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#6B7280"
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Today's Doses */}
        {todayDoses && todayDoses.length > 0 && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-100 mb-4">
              Today's Doses
            </Text>
            {todayDoses.map((dose) => (
              <Card key={dose.id} className="mb-3">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-green-900/40 items-center justify-center">
                    <Ionicons name="checkmark" size={20} color="#4ADE80" />
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="font-medium text-gray-100">
                      {dose.substance.name}
                    </Text>
                    <Text className="text-gray-400 text-sm">
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
