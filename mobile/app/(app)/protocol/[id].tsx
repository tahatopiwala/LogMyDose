import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProtocol, useUpdateProtocolStatus } from "../../../src/hooks/useProtocols";
import { useCycles } from "../../../src/hooks/useCycles";
import { useTitrations } from "../../../src/hooks/useTitrations";
import { Card, Badge } from "../../../src/components/ui";
import { CycleStatusBadge } from "../../../src/components/CycleStatusBadge";
import { TitrationProgressCard } from "../../../src/components/TitrationProgress";
import { CycleWithSubstance, TitrationPhaseWithSubstance } from "../../../src/types/domain";

export default function ProtocolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: protocol, isLoading, error } = useProtocol(id || "");
  const updateStatus = useUpdateProtocolStatus();
  const { data: allCycles } = useCycles();
  const { data: allTitrations } = useTitrations();

  // Filter cycles and titrations for this protocol's substances
  const protocolSubstanceIds = protocol?.substances.map((s) => s.id) || [];

  const cycles = (allCycles || []).filter((c: CycleWithSubstance) =>
    protocolSubstanceIds.includes(c.protocolSubstanceId) && c.status !== "completed"
  );

  const titrations = (allTitrations || []).filter((t: TitrationPhaseWithSubstance) =>
    protocolSubstanceIds.includes(t.protocolSubstanceId) && t.status === "active"
  );

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

  const handlePauseProtocol = () => {
    if (!protocol) return;

    Alert.alert(
      "Pause Protocol",
      "Pausing this protocol will stop scheduled reminders and exclude it from dose logging. You can resume it at any time.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pause",
          style: "destructive",
          onPress: () => {
            updateStatus.mutate(
              { id: protocol.id, status: "paused" },
              {
                onSuccess: () => {
                  Alert.alert("Protocol Paused", "You can resume it anytime from this screen.");
                },
                onError: () => {
                  Alert.alert("Error", "Failed to pause protocol. Please try again.");
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleResumeProtocol = () => {
    if (!protocol) return;

    Alert.alert(
      "Resume Protocol",
      "Resume this protocol to continue tracking doses?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Resume",
          onPress: () => {
            updateStatus.mutate(
              { id: protocol.id, status: "active" },
              {
                onSuccess: () => {
                  Alert.alert("Protocol Resumed", "Your protocol is now active again.");
                },
                onError: () => {
                  Alert.alert("Error", "Failed to resume protocol. Please try again.");
                },
              }
            );
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#39FF14" size="large" />
          <Text className="text-gray-400 mt-4">Loading protocol...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !protocol) {
    return (
      <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#F87171" />
          <Text className="text-gray-100 font-semibold text-lg mt-4">
            Protocol not found
          </Text>
          <Text className="text-gray-400 mt-2 text-center">
            {error?.message || "Unable to load protocol details."}
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-primary-500 px-6 py-3 rounded-xl"
          >
            <Text className="text-surface-base font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center mb-4"
          >
            <Ionicons name="chevron-back" size={24} color="#9CA3AF" />
            <Text className="text-gray-400 ml-1">Back</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <Text className="text-2xl font-bold text-gray-100 flex-1">
              {protocol.template?.name || "Custom Protocol"}
            </Text>
            <Badge variant={getStatusVariant(protocol.status)}>
              {protocol.status}
            </Badge>
          </View>

          {protocol.startDate && (
            <Text className="text-gray-400 mt-2">
              Started {formatDate(protocol.startDate)}
              {protocol.endDate && ` • Ends ${formatDate(protocol.endDate)}`}
            </Text>
          )}
        </View>

        {/* Paused Banner */}
        {protocol.status === "paused" && (
          <View className="mx-5 mt-4 bg-amber-900/30 border border-amber-800 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons name="pause-circle" size={24} color="#FBBF24" />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-amber-400">
                  Protocol Paused
                </Text>
                <Text className="text-amber-300 text-sm mt-1">
                  This protocol won't appear in dose logging. Resume it to continue tracking.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Substances */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-gray-100 mb-4">
            Substances
          </Text>

          {protocol.substances.map((ps) => (
            <Card key={ps.id} className="mb-3">
              <Text className="font-semibold text-gray-100 text-lg">
                {ps.substance.name}
              </Text>

              <View className="flex-row flex-wrap mt-3 gap-x-6 gap-y-2">
                <View>
                  <Text className="text-gray-400 text-xs uppercase font-medium">
                    Dose
                  </Text>
                  <Text className="text-gray-100 mt-1">
                    {ps.dose} {ps.doseUnit || ps.substance.doseUnit || ""}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-400 text-xs uppercase font-medium">
                    Frequency
                  </Text>
                  <Text className="text-gray-100 mt-1">
                    {ps.frequency?.replace(/_/g, " ") || "as needed"}
                  </Text>
                </View>

                {ps.cycleOnWeeks && (
                  <View>
                    <Text className="text-gray-400 text-xs uppercase font-medium">
                      Cycling
                    </Text>
                    <Text className="text-gray-100 mt-1">
                      {ps.cycleOnWeeks}w on / {ps.cycleOffWeeks || 0}w off
                    </Text>
                  </View>
                )}

                {ps.substance.administrationRoute && (
                  <View>
                    <Text className="text-gray-400 text-xs uppercase font-medium">
                      Route
                    </Text>
                    <Text className="text-gray-100 mt-1">
                      {ps.substance.administrationRoute}
                    </Text>
                  </View>
                )}
              </View>

              {ps.notes && (
                <View className="mt-3 bg-surface-elevated rounded-lg p-3">
                  <Text className="text-gray-300 text-sm">{ps.notes}</Text>
                </View>
              )}
            </Card>
          ))}
        </View>

        {/* Active Cycles */}
        {cycles.length > 0 && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-100 mb-4">
              Active Cycles
            </Text>
            {cycles.map((cycle: CycleWithSubstance) => {
              const totalWeeks = cycle.onWeeks + cycle.offWeeks;
              const currentWeekInCycle = ((cycle.currentWeek - 1) % totalWeeks) + 1;
              const isOnPhase = currentWeekInCycle <= cycle.onWeeks;
              const progressPercent = (currentWeekInCycle / totalWeeks) * 100;
              const onPhasePercent = (cycle.onWeeks / totalWeeks) * 100;

              return (
                <Card key={cycle.id} className="mb-3">
                  <View className="flex-row items-center justify-between mb-3">
                    <View>
                      <Text className="font-semibold text-gray-100">
                        {cycle.protocolSubstance.substance.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Cycle #{cycle.cycleNumber} • Week {cycle.currentWeek}
                      </Text>
                    </View>
                    <CycleStatusBadge status={cycle.status} compact />
                  </View>

                  {/* Progress bar */}
                  <View className="h-3 bg-surface-elevated rounded-full overflow-hidden mb-2">
                    <View
                      className="absolute h-full bg-green-500/20"
                      style={{ width: `${onPhasePercent}%` }}
                    />
                    <View
                      className={`h-full rounded-full ${isOnPhase ? "bg-green-500" : "bg-amber-500"}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </View>

                  <View className="flex-row justify-between">
                    <View className="flex-row items-center">
                      <View className={`w-2 h-2 rounded-full ${isOnPhase ? "bg-green-500" : "bg-green-500/30"} mr-1`} />
                      <Text className={`text-xs ${isOnPhase ? "text-green-400" : "text-gray-500"}`}>
                        {cycle.onWeeks}w on
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className={`w-2 h-2 rounded-full ${!isOnPhase ? "bg-amber-500" : "bg-amber-500/30"} mr-1`} />
                      <Text className={`text-xs ${!isOnPhase ? "text-amber-400" : "text-gray-500"}`}>
                        {cycle.offWeeks}w off
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {/* Active Titrations */}
        {titrations.length > 0 && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-100 mb-4">
              Titration Progress
            </Text>
            {titrations.map((titration: TitrationPhaseWithSubstance) => (
              <Card key={titration.id} className="mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-semibold text-gray-100">
                    {titration.protocolSubstance.substance.name}
                  </Text>
                  <View className={`px-2 py-1 rounded-full ${
                    titration.isMaintenancePhase
                      ? "bg-green-500/20"
                      : "bg-primary-500/20"
                  }`}>
                    <Text className={`text-xs font-semibold ${
                      titration.isMaintenancePhase
                        ? "text-green-400"
                        : "text-primary-400"
                    }`}>
                      {titration.isMaintenancePhase ? "MAINT" : "TITRATING"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-baseline mb-2">
                  <Text className="text-2xl font-bold text-primary-500">
                    {Number(titration.doseAmount)}
                  </Text>
                  <Text className="text-gray-400 ml-1">{titration.doseUnit}</Text>
                  {titration.targetDose && (
                    <Text className="text-gray-500 ml-2 text-sm">
                      → {Number(titration.targetDose)} {titration.doseUnit}
                    </Text>
                  )}
                </View>

                <Text className="text-sm text-gray-400">
                  Phase {titration.phaseNumber} • {titration.weeksAtDose} weeks at this dose
                </Text>
              </Card>
            ))}
          </View>
        )}

        {/* Protocol Notes */}
        {protocol.notes && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-gray-100 mb-4">
              Notes
            </Text>
            <Card>
              <Text className="text-gray-300 leading-relaxed">
                {protocol.notes}
              </Text>
            </Card>
          </View>
        )}

        {/* Action Buttons */}
        <View className="px-5 mt-8 gap-3">
          {protocol.status === "active" && (
            <>
              <TouchableOpacity
                onPress={() => router.push("/(app)/log")}
                className="bg-primary-500 rounded-xl py-4 flex-row items-center justify-center"
              >
                <Ionicons name="add-circle" size={24} color="#0D0D0D" />
                <Text className="text-surface-base font-semibold text-lg ml-2">
                  Log a Dose
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePauseProtocol}
                disabled={updateStatus.isPending}
                className="border-2 border-amber-500 rounded-xl py-4 flex-row items-center justify-center"
                style={{ opacity: updateStatus.isPending ? 0.5 : 1 }}
              >
                <Ionicons name="pause-circle-outline" size={24} color="#FBBF24" />
                <Text className="text-amber-400 font-semibold text-lg ml-2">
                  {updateStatus.isPending ? "Pausing..." : "Pause Protocol"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {protocol.status === "paused" && (
            <TouchableOpacity
              onPress={handleResumeProtocol}
              disabled={updateStatus.isPending}
              className="bg-green-600 rounded-xl py-4 flex-row items-center justify-center"
              style={{ opacity: updateStatus.isPending ? 0.5 : 1 }}
            >
              <Ionicons name="play-circle" size={24} color="white" />
              <Text className="text-white font-semibold text-lg ml-2">
                {updateStatus.isPending ? "Resuming..." : "Resume Protocol"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
