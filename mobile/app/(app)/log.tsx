import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useActiveSubstances, useSubstances, useLogDose, useActiveVialsBySubstance, Vial } from "../../src/hooks";
import { Card, Button, Input } from "../../src/components/ui";
import { ActiveProtocolSubstance } from "../../src/types/domain";

type LogType = "protocol" | "adhoc" | null;
type FastingState = "fasted" | "fed" | "unknown";
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";
type NeedleGauge = "25g" | "27g" | "29g" | "30g" | "31g";
type InjectionDepth = "subcutaneous" | "intramuscular";

const INJECTION_SITES = [
  "Abdomen",
  "Thigh",
  "Upper Arm",
  "Gluteal",
];

const NEEDLE_GAUGES: NeedleGauge[] = ["25g", "27g", "29g", "30g", "31g"];

// Determine time of day from current hour
const getTimeOfDay = (): TimeOfDay => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

interface ProtocolGroup {
  protocol: {
    id: string;
    name: string | null;
    status: string;
  };
  substances: ActiveProtocolSubstance[];
}

interface Substance {
  id: string;
  name: string;
  aliases?: string[];
  defaultDose: number | string | null;
  doseUnit: string | null;
  administrationRoute: string | null;
}

export default function LogDoseScreen() {
  const router = useRouter();
  const { data: protocolSubstances, isLoading: loadingProtocols } = useActiveSubstances();
  const { data: allSubstances, isLoading: loadingSubstances } = useSubstances();
  const logDoseMutation = useLogDose();

  // Flow state
  const [logType, setLogType] = useState<LogType>(null);
  const [selectedProtocolSubstance, setSelectedProtocolSubstance] =
    useState<ActiveProtocolSubstance | null>(null);
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(null);

  // Form state
  const [dose, setDose] = useState("");
  const [notes, setNotes] = useState("");
  const [adHocSearch, setAdHocSearch] = useState("");

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fastingState, setFastingState] = useState<FastingState | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());
  const [administrationSite, setAdministrationSite] = useState<string | null>(null);
  const [needleGauge, setNeedleGauge] = useState<NeedleGauge | null>(null);
  const [injectionDepth, setInjectionDepth] = useState<InjectionDepth | null>(null);
  const [selectedVial, setSelectedVial] = useState<Vial | null>(null);

  // Get the current substance ID for fetching vials
  const currentSubstanceId = logType === "protocol" && selectedProtocolSubstance
    ? selectedProtocolSubstance.substanceId
    : logType === "adhoc" && selectedSubstance
      ? selectedSubstance.id
      : undefined;

  // Fetch active vials for the selected substance
  const { data: vialsData } = useActiveVialsBySubstance(currentSubstanceId);
  const activeVials = vialsData || [];

  const isLoading = loadingProtocols || loadingSubstances;

  // Calculate current step
  const currentStep = useMemo(() => {
    if (!logType) return 1;
    if (!selectedProtocolSubstance && !selectedSubstance) return 2;
    return 3;
  }, [logType, selectedProtocolSubstance, selectedSubstance]);

  // Group protocol substances by protocol
  const protocolGroups = useMemo((): ProtocolGroup[] => {
    if (!protocolSubstances) return [];

    const grouped = new Map<string, ProtocolGroup>();

    protocolSubstances.forEach((ps) => {
      const existing = grouped.get(ps.protocol.id);
      if (existing) {
        existing.substances.push(ps);
      } else {
        grouped.set(ps.protocol.id, {
          protocol: {
            id: ps.protocol.id,
            name: ps.protocol.name,
            status: ps.protocol.status,
          },
          substances: [ps],
        });
      }
    });

    return Array.from(grouped.values());
  }, [protocolSubstances]);

  // Filter substances for ad-hoc search
  const filteredSubstances = useMemo(() => {
    if (!allSubstances) return [];
    if (!adHocSearch.trim()) return allSubstances.slice(0, 20);
    const search = adHocSearch.toLowerCase();
    return allSubstances.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.aliases?.some((a) => a.toLowerCase().includes(search))
    );
  }, [allSubstances, adHocSearch]);

  const handleSelectProtocolSubstance = (ps: ActiveProtocolSubstance) => {
    setSelectedProtocolSubstance(ps);
    setSelectedSubstance(null);
    setDose(String(ps.dose));
  };

  const handleSelectAdHocSubstance = (substance: Substance) => {
    setSelectedSubstance(substance);
    setSelectedProtocolSubstance(null);
    setDose(substance.defaultDose ? String(substance.defaultDose) : "");
  };

  const handleLogDose = async () => {
    if (logType === "protocol" && !selectedProtocolSubstance) return;
    if (logType === "adhoc" && !selectedSubstance) return;

    try {
      // Build context fields object
      const contextFields = {
        fastingState: fastingState || undefined,
        timeOfDay: timeOfDay || undefined,
        administrationSite: administrationSite || undefined,
        needleGauge: needleGauge || undefined,
        injectionDepth: injectionDepth || undefined,
        vialId: selectedVial?.id || undefined,
        productId: selectedVial?.productId || undefined,
      };

      if (logType === "protocol" && selectedProtocolSubstance) {
        await logDoseMutation.mutateAsync({
          protocolSubstanceId: selectedProtocolSubstance.id,
          substanceId: selectedProtocolSubstance.substanceId,
          dose: parseFloat(dose),
          doseUnit: selectedProtocolSubstance.doseUnit || undefined,
          status: "taken",
          notes: notes || undefined,
          ...contextFields,
        });
      } else if (logType === "adhoc" && selectedSubstance) {
        await logDoseMutation.mutateAsync({
          substanceId: selectedSubstance.id,
          dose: parseFloat(dose),
          doseUnit: selectedSubstance.doseUnit || undefined,
          status: "taken",
          notes: notes || undefined,
          ...contextFields,
        });
      }

      Alert.alert("Success", "Dose logged successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch {
      Alert.alert("Error", "Failed to log dose. Please try again.");
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      setSelectedProtocolSubstance(null);
      setSelectedSubstance(null);
      setDose("");
      setNotes("");
      // Reset advanced options
      setShowAdvanced(false);
      setFastingState(null);
      setTimeOfDay(getTimeOfDay());
      setAdministrationSite(null);
      setNeedleGauge(null);
      setInjectionDepth(null);
      setSelectedVial(null);
    } else if (currentStep === 2) {
      setLogType(null);
      setAdHocSearch("");
    } else {
      router.back();
    }
  };

  const currentDoseUnit =
    logType === "protocol" && selectedProtocolSubstance
      ? selectedProtocolSubstance.doseUnit || selectedProtocolSubstance.substance.doseUnit || "units"
      : logType === "adhoc" && selectedSubstance
        ? selectedSubstance.doseUnit || "units"
        : "units";

  // Check if the selected substance is injectable
  const isInjectable = useMemo(() => {
    if (logType === "protocol" && selectedProtocolSubstance) {
      const route = selectedProtocolSubstance.substance.administrationRoute;
      return route?.includes("injection") || false;
    }
    if (logType === "adhoc" && selectedSubstance) {
      return selectedSubstance.administrationRoute?.includes("injection") || false;
    }
    return false;
  }, [logType, selectedProtocolSubstance, selectedSubstance]);

  const stepLabels = ["Choose type", "Select substance", "Enter details"];

  return (
    <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-surface-card border-b border-surface-border">
          <View className="flex-row items-center px-5 py-4">
            <TouchableOpacity onPress={handleBack} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-100">Log a Dose</Text>
            </View>
            <Text className="text-sm text-gray-400">
              Step {currentStep} of 3
            </Text>
          </View>

          {/* Step Progress Bar */}
          <View className="px-5 pb-4">
            <View className="flex-row gap-2 mb-2">
              {[1, 2, 3].map((step) => (
                <View
                  key={step}
                  className={`flex-1 h-1.5 rounded-full ${
                    step <= currentStep ? "bg-primary-500" : "bg-surface-border"
                  }`}
                />
              ))}
            </View>
            <Text className="text-gray-400 text-sm">
              {stepLabels[currentStep - 1]}
            </Text>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#39FF14" />
            <Text className="text-gray-400 mt-4">Loading...</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Step 1: Choose Log Type */}
            {currentStep === 1 && (
              <View className="gap-4">
                {/* Protocol Option */}
                <TouchableOpacity
                  onPress={() => protocolGroups.length > 0 && setLogType("protocol")}
                  disabled={protocolGroups.length === 0}
                  className={`p-5 rounded-xl border-2 ${
                    protocolGroups.length === 0
                      ? "border-surface-border bg-surface-raised"
                      : "border-surface-border bg-surface-card"
                  }`}
                >
                  <View className="flex-row items-start">
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center ${
                        protocolGroups.length === 0 ? "bg-surface-elevated" : "bg-primary-500/20"
                      }`}
                    >
                      <Ionicons
                        name="clipboard-outline"
                        size={24}
                        color={protocolGroups.length === 0 ? "#6B7280" : "#39FF14"}
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text
                        className={`font-semibold text-lg ${
                          protocolGroups.length === 0 ? "text-gray-500" : "text-gray-100"
                        }`}
                      >
                        Log from Protocol
                      </Text>
                      <Text
                        className={`text-sm mt-1 ${
                          protocolGroups.length === 0 ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {protocolGroups.length === 0
                          ? "No active protocols available"
                          : `${protocolGroups.length} active protocol${protocolGroups.length > 1 ? "s" : ""}`}
                      </Text>
                    </View>
                    {protocolGroups.length > 0 && (
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Ad-hoc Option */}
                <TouchableOpacity
                  onPress={() => setLogType("adhoc")}
                  className="p-5 rounded-xl border-2 border-surface-border bg-surface-card"
                >
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 rounded-xl bg-blue-900/40 items-center justify-center">
                      <Ionicons name="flash-outline" size={24} color="#60A5FA" />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-lg text-gray-100">
                        Quick Log
                      </Text>
                      <Text className="text-sm text-gray-400 mt-1">
                        Log a one-time dose without tracking
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>

                {/* Create Protocol Option */}
                <TouchableOpacity
                  onPress={() => router.push("/protocols/new")}
                  className="p-5 rounded-xl border-2 border-dashed border-surface-border bg-surface-card"
                >
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 rounded-xl bg-surface-elevated items-center justify-center">
                      <Ionicons name="add" size={24} color="#9CA3AF" />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-lg text-gray-100">
                        Create Custom Protocol
                      </Text>
                      <Text className="text-sm text-gray-400 mt-1">
                        Set up a new protocol with tracking
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>

                {/* Cancel */}
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="py-3 items-center"
                >
                  <Text className="text-gray-400 font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Select Protocol Substance */}
            {currentStep === 2 && logType === "protocol" && (
              <View className="gap-4">
                {protocolGroups.map((group) => (
                  <Card key={group.protocol.id}>
                    <View className="bg-surface-elevated -mx-4 -mt-4 px-4 py-3 mb-3 border-b border-surface-border rounded-t-xl">
                      <Text className="font-medium text-gray-100">
                        {group.protocol.name || "Unnamed Protocol"}
                      </Text>
                    </View>
                    {group.substances.map((ps, index) => (
                      <TouchableOpacity
                        key={ps.id}
                        onPress={() => handleSelectProtocolSubstance(ps)}
                        className={`flex-row items-center py-3 ${
                          index < group.substances.length - 1
                            ? "border-b border-surface-border"
                            : ""
                        }`}
                      >
                        <View className="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center">
                          <Ionicons name="flask" size={20} color="#39FF14" />
                        </View>
                        <View className="ml-3 flex-1">
                          <Text className="font-medium text-gray-100">
                            {ps.substance.name}
                          </Text>
                          <Text className="text-gray-400 text-sm">
                            {ps.dose} {ps.doseUnit || ps.substance.doseUnit} •{" "}
                            {ps.frequency?.replace("_", " ") || "as needed"}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                      </TouchableOpacity>
                    ))}
                  </Card>
                ))}

                <TouchableOpacity
                  onPress={handleBack}
                  className="py-3 px-4 border border-surface-border rounded-lg items-center"
                >
                  <Text className="text-gray-300 font-medium">Back</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Select Ad-hoc Substance */}
            {currentStep === 2 && logType === "adhoc" && (
              <View className="gap-4">
                <TextInput
                  placeholder="Search substances..."
                  value={adHocSearch}
                  onChangeText={setAdHocSearch}
                  className="border border-surface-border rounded-lg px-4 py-3 bg-surface-raised text-gray-100"
                  placeholderTextColor="#6B7280"
                  autoFocus
                />

                <View className="flex-row flex-wrap gap-2">
                  {filteredSubstances.map((substance) => (
                    <TouchableOpacity
                      key={substance.id}
                      onPress={() => handleSelectAdHocSubstance(substance)}
                      className="px-4 py-2.5 border border-surface-border rounded-lg bg-surface-card"
                    >
                      <Text className="text-gray-300 text-sm">{substance.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {filteredSubstances.length === 0 && adHocSearch && (
                    <Text className="text-gray-400 text-sm py-4">
                      No substances found matching "{adHocSearch}"
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleBack}
                  className="py-3 px-4 border border-surface-border rounded-lg items-center"
                >
                  <Text className="text-gray-300 font-medium">Back</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Enter Dose Details */}
            {currentStep === 3 && (
              <View className="gap-4">
                {/* Selected item header */}
                <Card className="bg-primary-500/10 border-primary-500/30">
                  <View>
                    <Text className="text-primary-400 text-sm font-medium">
                      {logType === "protocol" ? "Protocol Dose" : "Quick Log"}
                    </Text>
                    <Text className="font-semibold text-gray-100 text-lg">
                      {logType === "protocol" && selectedProtocolSubstance
                        ? selectedProtocolSubstance.substance.name
                        : selectedSubstance?.name}
                    </Text>
                    {logType === "protocol" && selectedProtocolSubstance && (
                      <Text className="text-gray-400 text-sm">
                        from {selectedProtocolSubstance.protocol.name || "Unnamed Protocol"}
                      </Text>
                    )}
                  </View>
                </Card>

                <Input
                  label="Dose Amount"
                  value={dose}
                  onChangeText={setDose}
                  keyboardType="decimal-pad"
                  placeholder="Enter dose"
                />

                <View>
                  <Text className="text-gray-300 mb-2 font-medium text-sm">Unit</Text>
                  <View className="border border-surface-border rounded-lg px-4 py-3 bg-surface-elevated">
                    <Text className="text-gray-400">{currentDoseUnit}</Text>
                  </View>
                </View>

                {logType === "protocol" && selectedProtocolSubstance && (
                  <Text className="text-gray-400 text-xs -mt-2">
                    Protocol dose: {selectedProtocolSubstance.dose}{" "}
                    {selectedProtocolSubstance.doseUnit || selectedProtocolSubstance.substance.doseUnit}
                  </Text>
                )}

                <Input
                  label="Notes (optional)"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any notes about this dose..."
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />

                {/* Advanced Options Toggle */}
                <TouchableOpacity
                  onPress={() => setShowAdvanced(!showAdvanced)}
                  className="flex-row items-center justify-between py-3 px-4 border border-surface-border rounded-lg bg-surface-card"
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="options-outline"
                      size={20}
                      color="#9CA3AF"
                    />
                    <Text className="text-gray-300 ml-2 font-medium">
                      Advanced Options
                    </Text>
                  </View>
                  <Ionicons
                    name={showAdvanced ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>

                {/* Advanced Options Content */}
                {showAdvanced && (
                  <View className="gap-4 p-4 border border-surface-border rounded-lg bg-surface-raised">
                    {/* Fasting State */}
                    <View>
                      <Text className="text-gray-300 mb-2 font-medium text-sm">
                        Fasting State
                      </Text>
                      <View className="flex-row gap-2">
                        {(["fasted", "fed", "unknown"] as FastingState[]).map(
                          (state) => (
                            <TouchableOpacity
                              key={state}
                              onPress={() =>
                                setFastingState(
                                  fastingState === state ? null : state
                                )
                              }
                              className={`flex-1 py-2.5 px-3 rounded-lg border ${
                                fastingState === state
                                  ? "border-primary-500 bg-primary-500/20"
                                  : "border-surface-border bg-surface-card"
                              }`}
                            >
                              <Text
                                className={`text-center text-sm capitalize ${
                                  fastingState === state
                                    ? "text-primary-400 font-medium"
                                    : "text-gray-400"
                                }`}
                              >
                                {state}
                              </Text>
                            </TouchableOpacity>
                          )
                        )}
                      </View>
                    </View>

                    {/* Time of Day */}
                    <View>
                      <Text className="text-gray-300 mb-2 font-medium text-sm">
                        Time of Day
                      </Text>
                      <View className="flex-row gap-2 flex-wrap">
                        {(
                          [
                            "morning",
                            "afternoon",
                            "evening",
                            "night",
                          ] as TimeOfDay[]
                        ).map((time) => (
                          <TouchableOpacity
                            key={time}
                            onPress={() => setTimeOfDay(time)}
                            className={`py-2 px-4 rounded-lg border ${
                              timeOfDay === time
                                ? "border-primary-500 bg-primary-500/20"
                                : "border-surface-border bg-surface-card"
                            }`}
                          >
                            <Text
                              className={`text-sm capitalize ${
                                timeOfDay === time
                                  ? "text-primary-400 font-medium"
                                  : "text-gray-400"
                              }`}
                            >
                              {time}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Injection-specific fields */}
                    {isInjectable && (
                      <>
                        {/* Vial Selection */}
                        {activeVials.length > 0 && (
                          <View>
                            <Text className="text-gray-300 mb-2 font-medium text-sm">
                              Select Vial (Optional)
                            </Text>
                            <View className="gap-2">
                              {/* None option */}
                              <TouchableOpacity
                                onPress={() => setSelectedVial(null)}
                                className={`p-3 rounded-lg border ${
                                  !selectedVial
                                    ? "border-primary-500 bg-primary-500/20"
                                    : "border-surface-border bg-surface-card"
                                }`}
                              >
                                <Text
                                  className={`text-sm ${
                                    !selectedVial
                                      ? "text-primary-400 font-medium"
                                      : "text-gray-400"
                                  }`}
                                >
                                  No vial tracking
                                </Text>
                              </TouchableOpacity>
                              {/* Vial options */}
                              {activeVials.map((vial) => (
                                <TouchableOpacity
                                  key={vial.id}
                                  onPress={() => setSelectedVial(vial)}
                                  className={`p-3 rounded-lg border ${
                                    selectedVial?.id === vial.id
                                      ? "border-primary-500 bg-primary-500/20"
                                      : "border-surface-border bg-surface-card"
                                  }`}
                                >
                                  <View className="flex-row justify-between items-center">
                                    <View>
                                      <Text
                                        className={`text-sm font-medium ${
                                          selectedVial?.id === vial.id
                                            ? "text-primary-400"
                                            : "text-gray-300"
                                        }`}
                                      >
                                        {vial.product.name}
                                      </Text>
                                      <Text className="text-xs text-gray-500 mt-0.5">
                                        {vial.lotNumber
                                          ? `Lot: ${vial.lotNumber}`
                                          : "No lot number"}
                                        {vial.remainingAmountMcg !== null &&
                                          ` • ${vial.remainingAmountMcg} mcg remaining`}
                                      </Text>
                                    </View>
                                    {vial.reconstitutedAt && (
                                      <View className="bg-blue-900/40 px-2 py-1 rounded">
                                        <Text className="text-xs text-blue-400">
                                          Reconstituted
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Administration Site */}
                        <View>
                          <Text className="text-gray-300 mb-2 font-medium text-sm">
                            Injection Site
                          </Text>
                          <View className="flex-row gap-2 flex-wrap">
                            {INJECTION_SITES.map((site) => (
                              <TouchableOpacity
                                key={site}
                                onPress={() =>
                                  setAdministrationSite(
                                    administrationSite === site ? null : site
                                  )
                                }
                                className={`py-2 px-4 rounded-lg border ${
                                  administrationSite === site
                                    ? "border-primary-500 bg-primary-500/20"
                                    : "border-surface-border bg-surface-card"
                                }`}
                              >
                                <Text
                                  className={`text-sm ${
                                    administrationSite === site
                                      ? "text-primary-400 font-medium"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {site}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>

                        {/* Injection Depth */}
                        <View>
                          <Text className="text-gray-300 mb-2 font-medium text-sm">
                            Injection Depth
                          </Text>
                          <View className="flex-row gap-2">
                            {(
                              ["subcutaneous", "intramuscular"] as InjectionDepth[]
                            ).map((depth) => (
                              <TouchableOpacity
                                key={depth}
                                onPress={() =>
                                  setInjectionDepth(
                                    injectionDepth === depth ? null : depth
                                  )
                                }
                                className={`flex-1 py-2.5 px-3 rounded-lg border ${
                                  injectionDepth === depth
                                    ? "border-primary-500 bg-primary-500/20"
                                    : "border-surface-border bg-surface-card"
                                }`}
                              >
                                <Text
                                  className={`text-center text-sm capitalize ${
                                    injectionDepth === depth
                                      ? "text-primary-400 font-medium"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {depth === "subcutaneous" ? "SubQ" : "IM"}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>

                        {/* Needle Gauge */}
                        <View>
                          <Text className="text-gray-300 mb-2 font-medium text-sm">
                            Needle Gauge
                          </Text>
                          <View className="flex-row gap-2 flex-wrap">
                            {NEEDLE_GAUGES.map((gauge) => (
                              <TouchableOpacity
                                key={gauge}
                                onPress={() =>
                                  setNeedleGauge(
                                    needleGauge === gauge ? null : gauge
                                  )
                                }
                                className={`py-2 px-4 rounded-lg border ${
                                  needleGauge === gauge
                                    ? "border-primary-500 bg-primary-500/20"
                                    : "border-surface-border bg-surface-card"
                                }`}
                              >
                                <Text
                                  className={`text-sm ${
                                    needleGauge === gauge
                                      ? "text-primary-400 font-medium"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {gauge}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                )}

                <View className="flex-row gap-3 pt-2">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 py-3 px-4 border border-surface-border rounded-lg items-center"
                  >
                    <Text className="text-gray-300 font-medium">Back</Text>
                  </TouchableOpacity>
                  <Button
                    onPress={handleLogDose}
                    loading={logDoseMutation.isPending}
                    disabled={!dose}
                    className="flex-1"
                  >
                    Log Dose
                  </Button>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
