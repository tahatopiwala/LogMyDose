import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TitrationProgress as TitrationProgressType, TitrationPhaseStatus } from "../types/domain";

interface TitrationProgressProps {
  progress: TitrationProgressType;
  substanceName: string;
}

const STATUS_COLORS = {
  active: { bg: "bg-primary-500", text: "text-primary-400" },
  completed: { bg: "bg-green-500", text: "text-green-400" },
  skipped: { bg: "bg-gray-500", text: "text-gray-400" },
};

export function TitrationProgressCard({
  progress,
  substanceName,
}: TitrationProgressProps) {
  const { currentPhase, phases, progressPercent, isAtMaintenance } = progress;

  return (
    <View className="bg-surface-card rounded-xl p-4 border border-surface-border">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-lg font-semibold text-gray-100">
            {substanceName} Titration
          </Text>
          <Text className="text-sm text-gray-500">
            Phase {currentPhase?.phaseNumber || 0} of {progress.totalPhases}
          </Text>
        </View>
        {isAtMaintenance ? (
          <View className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
            <Text className="text-green-400 font-semibold text-sm">
              At Maintenance
            </Text>
          </View>
        ) : (
          <View className="bg-primary-500/20 px-3 py-1 rounded-full border border-primary-500/30">
            <Text className="text-primary-400 font-semibold text-sm">
              Titrating
            </Text>
          </View>
        )}
      </View>

      {/* Current Dose */}
      <View className="bg-surface-elevated rounded-xl p-4 mb-4">
        <Text className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Current Dose
        </Text>
        <Text className="text-3xl font-bold text-primary-500">
          {progress.currentDose}
          <Text className="text-lg text-gray-400"> {progress.doseUnit}</Text>
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          Target: {progress.targetDose} {progress.doseUnit}
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-gray-400">Progress to Target</Text>
          <Text className="text-sm font-semibold text-gray-300">
            {Math.round(progressPercent)}%
          </Text>
        </View>
        <View className="h-3 bg-surface-elevated rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      {/* Phase Timeline */}
      <View>
        <Text className="text-sm font-semibold text-gray-400 mb-3">
          Dose Schedule
        </Text>
        <View className="space-y-2">
          {phases.map((phase, index) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              isActive={phase.status === "active"}
              isLast={index === phases.length - 1}
            />
          ))}
        </View>
      </View>

      {/* Next Phase Info */}
      {currentPhase && !isAtMaintenance && progress.nextPhaseDate && (
        <View className="mt-4 pt-4 border-t border-surface-border">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            <Text className="text-sm text-gray-400 ml-2">
              {progress.weeksRemainingInPhase} week
              {progress.weeksRemainingInPhase !== 1 ? "s" : ""} remaining at
              current dose
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

interface PhaseRowProps {
  phase: {
    id: string;
    phaseNumber: number;
    doseAmount: number | string;
    doseUnit: string;
    weeksAtDose: number;
    status: TitrationPhaseStatus;
    isMaintenancePhase: boolean;
  };
  isActive: boolean;
  isLast: boolean;
}

function PhaseRow({ phase, isActive, isLast }: PhaseRowProps) {
  const statusColors = STATUS_COLORS[phase.status];

  return (
    <View className="flex-row items-center">
      {/* Status indicator */}
      <View className="items-center mr-3">
        <View
          className={`w-4 h-4 rounded-full ${
            isActive ? "bg-primary-500" : statusColors.bg
          } ${phase.status === "completed" ? "opacity-100" : "opacity-50"}`}
        >
          {phase.status === "completed" && (
            <Ionicons
              name="checkmark"
              size={12}
              color="white"
              style={{ marginLeft: 2, marginTop: 2 }}
            />
          )}
        </View>
        {!isLast && (
          <View
            className={`w-0.5 h-6 ${
              phase.status === "completed" ? "bg-green-500" : "bg-surface-border"
            }`}
          />
        )}
      </View>

      {/* Phase info */}
      <View
        className={`flex-1 flex-row justify-between items-center py-1 ${
          isActive ? "opacity-100" : "opacity-60"
        }`}
      >
        <View>
          <Text
            className={`font-medium ${
              isActive ? "text-gray-100" : "text-gray-400"
            }`}
          >
            {Number(phase.doseAmount)} {phase.doseUnit}
            {phase.isMaintenancePhase && (
              <Text className="text-green-400"> (Maintenance)</Text>
            )}
          </Text>
        </View>
        <Text className="text-sm text-gray-500">
          {phase.weeksAtDose} week{phase.weeksAtDose !== 1 ? "s" : ""}
        </Text>
      </View>
    </View>
  );
}

interface TitrationStatusBadgeProps {
  isAtMaintenance: boolean;
  compact?: boolean;
}

export function TitrationStatusBadge({
  isAtMaintenance,
  compact = false,
}: TitrationStatusBadgeProps) {
  if (compact) {
    return (
      <View
        className={`flex-row items-center px-2 py-1 rounded-full ${
          isAtMaintenance
            ? "bg-green-500/20 border border-green-500/30"
            : "bg-primary-500/20 border border-primary-500/30"
        }`}
      >
        <View
          className={`w-2 h-2 rounded-full mr-1.5 ${
            isAtMaintenance ? "bg-green-500" : "bg-primary-500"
          }`}
        />
        <Text
          className={`text-xs font-semibold ${
            isAtMaintenance ? "text-green-400" : "text-primary-400"
          }`}
        >
          {isAtMaintenance ? "MAINT" : "TITRATING"}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-row items-center px-3 py-2 rounded-xl ${
        isAtMaintenance
          ? "bg-green-500/20 border border-green-500/30"
          : "bg-primary-500/20 border border-primary-500/30"
      }`}
    >
      <Ionicons
        name={isAtMaintenance ? "checkmark-circle" : "trending-up"}
        size={20}
        color={isAtMaintenance ? "#22C55E" : "#39FF14"}
      />
      <View className="ml-2">
        <Text
          className={`font-semibold ${
            isAtMaintenance ? "text-green-400" : "text-primary-400"
          }`}
        >
          {isAtMaintenance ? "At Maintenance" : "Titrating"}
        </Text>
      </View>
    </View>
  );
}
