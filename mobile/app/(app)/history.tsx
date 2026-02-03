import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useDoses } from "../../src/hooks";
import { Card } from "../../src/components/ui";

type FilterPeriod = "week" | "month" | "all";

export default function HistoryScreen() {
  const [period, setPeriod] = useState<FilterPeriod>("week");
  const [page, setPage] = useState(1);

  const dateRange = useMemo(() => {
    if (period === "all") {
      return {};
    }

    const now = new Date();
    const startDate = new Date();

    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }

    // Use date-only strings to prevent millisecond differences
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: now.toISOString().split("T")[0],
    };
  }, [period]);

  const { data, isLoading, refetch } = useDoses({
    ...dateRange,
    page,
    limit: 20,
  });

  const doses = data?.data || [];
  const meta = data?.meta;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Group doses by date
  const groupedDoses = doses.reduce(
    (groups, dose) => {
      const date = new Date(dose.loggedAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(dose);
      return groups;
    },
    {} as Record<string, typeof doses>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return { name: "checkmark-circle" as const, color: "#22C55E" };
      case "missed":
        return { name: "close-circle" as const, color: "#EF4444" };
      case "skipped":
        return { name: "remove-circle" as const, color: "#F59E0B" };
      default:
        return { name: "ellipse" as const, color: "#9CA3AF" };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">History</Text>

        {/* Period Filter */}
        <View className="flex-row gap-2 mt-4">
          {(["week", "month", "all"] as FilterPeriod[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => {
                setPeriod(p);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-full ${
                period === p ? "bg-primary-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`font-medium capitalize ${
                  period === p ? "text-white" : "text-gray-600"
                }`}
              >
                {p === "all" ? "All Time" : `This ${p}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#BE3455"
          />
        }
      >
        {isLoading && doses.length === 0 ? (
          <View className="py-12 items-center">
            <ActivityIndicator size="large" color="#BE3455" />
          </View>
        ) : doses.length === 0 ? (
          <Card>
            <View className="items-center py-8">
              <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
              <Text className="text-gray-600 mt-4 text-center">
                No doses logged yet
              </Text>
              <Text className="text-gray-400 text-sm mt-1 text-center">
                Start logging doses to see your history
              </Text>
            </View>
          </Card>
        ) : (
          Object.entries(groupedDoses).map(([date, dateDoses]) => (
            <View key={date} className="mb-6">
              <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {formatDate(dateDoses[0].loggedAt)}
              </Text>
              {dateDoses.map((dose) => {
                const icon = getStatusIcon(dose.status);
                return (
                  <Card key={dose.id} className="mb-2">
                    <View className="flex-row items-center">
                      <Ionicons name={icon.name} size={24} color={icon.color} />
                      <View className="ml-3 flex-1">
                        <Text className="font-medium text-gray-900">
                          {dose.substance.name}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {dose.dose} {dose.doseUnit || ""} •{" "}
                          {formatTime(dose.loggedAt)}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          ))
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <View className="flex-row justify-center items-center gap-4 mt-4">
            <TouchableOpacity
              onPress={() => setPage(page - 1)}
              disabled={page === 1}
              className={`p-2 ${page === 1 ? "opacity-30" : ""}`}
            >
              <Ionicons name="chevron-back" size={24} color="#BE3455" />
            </TouchableOpacity>
            <Text className="text-gray-600">
              Page {page} of {meta.totalPages}
            </Text>
            <TouchableOpacity
              onPress={() => setPage(page + 1)}
              disabled={page === meta.totalPages}
              className={`p-2 ${page === meta.totalPages ? "opacity-30" : ""}`}
            >
              <Ionicons name="chevron-forward" size={24} color="#BE3455" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
