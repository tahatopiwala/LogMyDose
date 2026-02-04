import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBiometrics, useBiometricStats, useLogBiometric } from "../../src/hooks";
import { Card } from "../../src/components/ui";
import { MetricType } from "../../src/types/domain";

const METRIC_CONFIG: Record<
  MetricType,
  { label: string; icon: string; unit: string; category: string }
> = {
  weight: { label: "Weight", icon: "scale-outline", unit: "kg", category: "Body" },
  blood_glucose: { label: "Blood Glucose", icon: "water-outline", unit: "mg/dL", category: "Vitals" },
  blood_pressure_systolic: { label: "BP Systolic", icon: "heart-outline", unit: "mmHg", category: "Vitals" },
  blood_pressure_diastolic: { label: "BP Diastolic", icon: "heart-outline", unit: "mmHg", category: "Vitals" },
  heart_rate: { label: "Heart Rate", icon: "pulse-outline", unit: "bpm", category: "Vitals" },
  body_fat_percentage: { label: "Body Fat", icon: "body-outline", unit: "%", category: "Body" },
  sleep_quality: { label: "Sleep Quality", icon: "moon-outline", unit: "/10", category: "Wellness" },
  energy_level: { label: "Energy Level", icon: "flash-outline", unit: "/10", category: "Wellness" },
  appetite_level: { label: "Appetite", icon: "restaurant-outline", unit: "/10", category: "Wellness" },
  pain_level: { label: "Pain Level", icon: "bandage-outline", unit: "/10", category: "Wellness" },
  mood: { label: "Mood", icon: "happy-outline", unit: "/10", category: "Wellness" },
  stress_level: { label: "Stress Level", icon: "alert-circle-outline", unit: "/10", category: "Wellness" },
  hydration: { label: "Hydration", icon: "water-outline", unit: "L", category: "Body" },
  steps: { label: "Steps", icon: "walk-outline", unit: "steps", category: "Activity" },
  calories_burned: { label: "Calories Burned", icon: "flame-outline", unit: "kcal", category: "Activity" },
};

const QUICK_LOG_METRICS: MetricType[] = [
  "weight",
  "energy_level",
  "sleep_quality",
  "mood",
  "stress_level",
  "blood_glucose",
];

type FilterPeriod = "week" | "month" | "all";

export default function BiometricsScreen() {
  const [period, setPeriod] = useState<FilterPeriod>("week");
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType | null>(null);
  const [logValue, setLogValue] = useState("");
  const [logNotes, setLogNotes] = useState("");

  const dateRange = useMemo(() => {
    if (period === "all") return {};
    const now = new Date();
    const startDate = new Date();
    if (period === "week") {
      startDate.setDate(now.getDate() - 7);
    } else {
      startDate.setMonth(now.getMonth() - 1);
    }
    return {
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    };
  }, [period]);

  const { data: entriesData, isLoading: entriesLoading, refetch } = useBiometrics({
    ...dateRange,
    limit: 20,
  });
  const { data: stats, isLoading: statsLoading } = useBiometricStats(dateRange);
  const logBiometric = useLogBiometric();

  const entries = entriesData?.data || [];
  const isLoading = entriesLoading || statsLoading;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

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

  const handleQuickLog = (metric: MetricType) => {
    setSelectedMetric(metric);
    setLogValue("");
    setLogNotes("");
    setShowLogModal(true);
  };

  const handleSubmitLog = async () => {
    if (!selectedMetric || !logValue) return;

    try {
      await logBiometric.mutateAsync({
        metricType: selectedMetric,
        value: parseFloat(logValue),
        unit: METRIC_CONFIG[selectedMetric].unit,
        notes: logNotes || undefined,
      });
      setShowLogModal(false);
      refetch();
    } catch (error) {
      console.error("Failed to log biometric:", error);
    }
  };

  // Group entries by date
  const groupedEntries = entries.reduce(
    (groups, entry) => {
      const date = new Date(entry.recordedAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(entry);
      return groups;
    },
    {} as Record<string, typeof entries>
  );

  return (
    <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 bg-surface-card border-b border-surface-border">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-100">Biometrics</Text>
          <TouchableOpacity
            onPress={() => handleQuickLog("weight")}
            className="bg-primary-500 px-4 py-2 rounded-full flex-row items-center"
          >
            <Ionicons name="add" size={20} color="#0D0D0D" />
            <Text className="text-surface-base font-semibold ml-1">Log</Text>
          </TouchableOpacity>
        </View>

        {/* Period Filter */}
        <View className="flex-row gap-2 mt-4">
          {(["week", "month", "all"] as FilterPeriod[]).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              className={`px-4 py-2 rounded-full ${
                period === p ? "bg-primary-500" : "bg-surface-elevated"
              }`}
            >
              <Text
                className={`font-medium capitalize ${
                  period === p ? "text-surface-base" : "text-gray-400"
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
            tintColor="#39FF14"
          />
        }
      >
        {/* Quick Log Buttons */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Quick Log
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {QUICK_LOG_METRICS.map((metric) => {
              const config = METRIC_CONFIG[metric];
              return (
                <TouchableOpacity
                  key={metric}
                  onPress={() => handleQuickLog(metric)}
                  className="bg-surface-card px-4 py-3 rounded-xl flex-row items-center"
                >
                  <Ionicons
                    name={config.icon as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color="#39FF14"
                  />
                  <Text className="text-gray-200 ml-2 font-medium">
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Stats Cards */}
        {stats && stats.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Summary
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {stats.slice(0, 4).map((stat) => {
                const config = METRIC_CONFIG[stat.metricType as MetricType];
                return (
                  <Card key={stat.metricType} className="flex-1 min-w-[45%]">
                    <View className="flex-row items-center mb-2">
                      <Ionicons
                        name={config?.icon as keyof typeof Ionicons.glyphMap || "analytics-outline"}
                        size={20}
                        color="#39FF14"
                      />
                      <Text className="text-gray-400 ml-2 text-sm">
                        {config?.label || stat.metricType}
                      </Text>
                    </View>
                    <Text className="text-2xl font-bold text-gray-100">
                      {stat.latest.toFixed(1)}
                      <Text className="text-sm text-gray-500">
                        {" "}{config?.unit || ""}
                      </Text>
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      Avg: {stat.avg.toFixed(1)} • {stat.count} entries
                    </Text>
                  </Card>
                );
              })}
            </View>
          </View>
        )}

        {/* Recent Entries */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Recent Entries
          </Text>

          {isLoading && entries.length === 0 ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color="#39FF14" />
            </View>
          ) : entries.length === 0 ? (
            <Card>
              <View className="items-center py-8">
                <Ionicons name="analytics-outline" size={48} color="#6B7280" />
                <Text className="text-gray-300 mt-4 text-center">
                  No biometric entries yet
                </Text>
                <Text className="text-gray-500 text-sm mt-1 text-center">
                  Start logging metrics to track your progress
                </Text>
              </View>
            </Card>
          ) : (
            Object.entries(groupedEntries).map(([date, dateEntries]) => (
              <View key={date} className="mb-4">
                <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {formatDate(dateEntries[0].recordedAt)}
                </Text>
                {dateEntries.map((entry) => {
                  const config = METRIC_CONFIG[entry.metricType as MetricType];
                  return (
                    <Card key={entry.id} className="mb-2">
                      <View className="flex-row items-center">
                        <View className="w-10 h-10 rounded-full bg-surface-elevated items-center justify-center">
                          <Ionicons
                            name={config?.icon as keyof typeof Ionicons.glyphMap || "analytics-outline"}
                            size={20}
                            color="#39FF14"
                          />
                        </View>
                        <View className="ml-3 flex-1">
                          <Text className="font-medium text-gray-100">
                            {config?.label || entry.metricType}
                          </Text>
                          <Text className="text-gray-400 text-sm">
                            {formatTime(entry.recordedAt)}
                            {entry.notes && ` • ${entry.notes}`}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-lg font-bold text-primary-500">
                            {Number(entry.value).toFixed(1)}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {entry.unit || config?.unit || ""}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Log Modal */}
      <Modal
        visible={showLogModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowLogModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowLogModal(false)}
            className="flex-1 bg-black/50"
          />
          <View className="bg-surface-card rounded-t-3xl p-6 pb-10">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-100">
                Log {selectedMetric && METRIC_CONFIG[selectedMetric]?.label}
              </Text>
              <TouchableOpacity onPress={() => setShowLogModal(false)}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Metric Selection */}
            <View className="mb-4">
              <Text className="text-sm text-gray-400 mb-2">Metric</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {QUICK_LOG_METRICS.map((metric) => (
                    <TouchableOpacity
                      key={metric}
                      onPress={() => setSelectedMetric(metric)}
                      className={`px-4 py-2 rounded-full ${
                        selectedMetric === metric
                          ? "bg-primary-500"
                          : "bg-surface-elevated"
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          selectedMetric === metric
                            ? "text-surface-base"
                            : "text-gray-400"
                        }`}
                      >
                        {METRIC_CONFIG[metric].label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Value Input */}
            <View className="mb-4">
              <Text className="text-sm text-gray-400 mb-2">Value</Text>
              <View className="flex-row items-center bg-surface-elevated rounded-xl px-4">
                <TextInput
                  value={logValue}
                  onChangeText={setLogValue}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#6B7280"
                  className="flex-1 py-4 text-gray-100 text-lg font-semibold"
                />
                <Text className="text-gray-400">
                  {selectedMetric && METRIC_CONFIG[selectedMetric]?.unit}
                </Text>
              </View>
            </View>

            {/* Notes Input */}
            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">Notes (optional)</Text>
              <TextInput
                value={logNotes}
                onChangeText={setLogNotes}
                placeholder="Add notes..."
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={2}
                className="bg-surface-elevated rounded-xl px-4 py-3 text-gray-100"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmitLog}
              disabled={!logValue || logBiometric.isPending}
              className={`py-4 rounded-xl items-center ${
                !logValue || logBiometric.isPending
                  ? "bg-gray-700"
                  : "bg-primary-500"
              }`}
            >
              {logBiometric.isPending ? (
                <ActivityIndicator color="#0D0D0D" />
              ) : (
                <Text className="font-bold text-surface-base text-lg">
                  Log Entry
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
