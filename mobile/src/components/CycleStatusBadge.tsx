import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CycleStatus, CyclePhaseInfo } from "../types/domain";

interface CycleStatusBadgeProps {
  status: CycleStatus;
  currentWeek?: number;
  totalWeeks?: number;
  compact?: boolean;
}

const STATUS_CONFIG = {
  on: {
    label: "ON",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
    borderColor: "border-green-500/30",
    icon: "checkmark-circle" as const,
    iconColor: "#22C55E",
  },
  off: {
    label: "OFF",
    bgColor: "bg-amber-500/20",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    icon: "pause-circle" as const,
    iconColor: "#F59E0B",
  },
  completed: {
    label: "DONE",
    bgColor: "bg-gray-500/20",
    textColor: "text-gray-400",
    borderColor: "border-gray-500/30",
    icon: "checkmark-done-circle" as const,
    iconColor: "#9CA3AF",
  },
};

export function CycleStatusBadge({
  status,
  currentWeek,
  totalWeeks,
  compact = false,
}: CycleStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (compact) {
    return (
      <View
        className={`flex-row items-center px-2 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}
      >
        <View
          className={`w-2 h-2 rounded-full mr-1.5`}
          style={{ backgroundColor: config.iconColor }}
        />
        <Text className={`text-xs font-semibold ${config.textColor}`}>
          {config.label}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-row items-center px-3 py-2 rounded-xl ${config.bgColor} border ${config.borderColor}`}
    >
      <Ionicons name={config.icon} size={20} color={config.iconColor} />
      <View className="ml-2">
        <Text className={`font-semibold ${config.textColor}`}>
          {status === "on" ? "On Cycle" : status === "off" ? "Off Cycle" : "Completed"}
        </Text>
        {currentWeek !== undefined && totalWeeks !== undefined && status !== "completed" && (
          <Text className="text-xs text-gray-500">
            Week {currentWeek} of {totalWeeks}
          </Text>
        )}
      </View>
    </View>
  );
}

interface CycleProgressProps {
  phaseInfo: CyclePhaseInfo;
  onWeeks: number;
  offWeeks: number;
}

export function CycleProgress({ phaseInfo, onWeeks, offWeeks }: CycleProgressProps) {
  const totalWeeks = onWeeks + offWeeks;
  const currentWeekInCycle = ((phaseInfo.currentWeek - 1) % totalWeeks) + 1;
  const isOnPhase = currentWeekInCycle <= onWeeks;

  // Calculate progress percentage
  const progressPercent = (currentWeekInCycle / totalWeeks) * 100;

  return (
    <View className="bg-surface-card rounded-xl p-4 border border-surface-border">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-100 font-semibold">Cycle Progress</Text>
        <CycleStatusBadge status={phaseInfo.status} compact />
      </View>

      {/* Progress bar */}
      <View className="h-3 bg-surface-elevated rounded-full overflow-hidden mb-3">
        {/* On phase section */}
        <View
          className="absolute h-full bg-green-500/30"
          style={{ width: `${(onWeeks / totalWeeks) * 100}%` }}
        />
        {/* Progress indicator */}
        <View
          className={`h-full ${isOnPhase ? "bg-green-500" : "bg-amber-500"} rounded-full`}
          style={{ width: `${progressPercent}%` }}
        />
      </View>

      {/* Week labels */}
      <View className="flex-row justify-between">
        <Text className="text-xs text-gray-500">
          Week {currentWeekInCycle}
        </Text>
        <Text className="text-xs text-gray-500">
          {phaseInfo.weeksRemaining} weeks remaining in {isOnPhase ? "on" : "off"} phase
        </Text>
      </View>

      {/* Phase breakdown */}
      <View className="flex-row mt-4 gap-3">
        <View className="flex-1 bg-green-500/10 rounded-lg p-3 border border-green-500/20">
          <Text className="text-green-400 text-xs font-medium">ON PHASE</Text>
          <Text className="text-gray-100 font-semibold">{onWeeks} weeks</Text>
        </View>
        <View className="flex-1 bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
          <Text className="text-amber-400 text-xs font-medium">OFF PHASE</Text>
          <Text className="text-gray-100 font-semibold">{offWeeks} weeks</Text>
        </View>
      </View>
    </View>
  );
}
