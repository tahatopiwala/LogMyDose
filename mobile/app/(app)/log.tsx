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
import { useActiveSubstances, useSubstances, useLogDose } from "../../src/hooks";
import { Card, Button, Input } from "../../src/components/ui";
import { ActiveProtocolSubstance } from "../../src/types/domain";

type LogType = "protocol" | "adhoc" | null;

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
      if (logType === "protocol" && selectedProtocolSubstance) {
        await logDoseMutation.mutateAsync({
          protocolSubstanceId: selectedProtocolSubstance.id,
          substanceId: selectedProtocolSubstance.substanceId,
          dose: parseFloat(dose),
          doseUnit: selectedProtocolSubstance.doseUnit || undefined,
          status: "taken",
          notes: notes || undefined,
        });
      } else if (logType === "adhoc" && selectedSubstance) {
        await logDoseMutation.mutateAsync({
          substanceId: selectedSubstance.id,
          dose: parseFloat(dose),
          doseUnit: selectedSubstance.doseUnit || undefined,
          status: "taken",
          notes: notes || undefined,
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

  const stepLabels = ["Choose type", "Select substance", "Enter details"];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row items-center px-5 py-4">
            <TouchableOpacity onPress={handleBack} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900">Log a Dose</Text>
            </View>
            <Text className="text-sm text-gray-500">
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
                    step <= currentStep ? "bg-primary-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </View>
            <Text className="text-gray-600 text-sm">
              {stepLabels[currentStep - 1]}
            </Text>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#BE3455" />
            <Text className="text-gray-500 mt-4">Loading...</Text>
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
                      ? "border-gray-100 bg-gray-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-start">
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center ${
                        protocolGroups.length === 0 ? "bg-gray-100" : "bg-primary-100"
                      }`}
                    >
                      <Ionicons
                        name="clipboard-outline"
                        size={24}
                        color={protocolGroups.length === 0 ? "#9CA3AF" : "#BE3455"}
                      />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text
                        className={`font-semibold text-lg ${
                          protocolGroups.length === 0 ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        Log from Protocol
                      </Text>
                      <Text
                        className={`text-sm mt-1 ${
                          protocolGroups.length === 0 ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {protocolGroups.length === 0
                          ? "No active protocols available"
                          : `${protocolGroups.length} active protocol${protocolGroups.length > 1 ? "s" : ""}`}
                      </Text>
                    </View>
                    {protocolGroups.length > 0 && (
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    )}
                  </View>
                </TouchableOpacity>

                {/* Ad-hoc Option */}
                <TouchableOpacity
                  onPress={() => setLogType("adhoc")}
                  className="p-5 rounded-xl border-2 border-gray-200 bg-white"
                >
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center">
                      <Ionicons name="flash-outline" size={24} color="#2563EB" />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-lg text-gray-900">
                        Quick Log
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        Log a one-time dose without tracking
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>

                {/* Create Protocol Option */}
                <TouchableOpacity
                  onPress={() => router.push("/protocols/new")}
                  className="p-5 rounded-xl border-2 border-dashed border-gray-300 bg-white"
                >
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center">
                      <Ionicons name="add" size={24} color="#6B7280" />
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="font-semibold text-lg text-gray-900">
                        Create Custom Protocol
                      </Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        Set up a new protocol with tracking
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>

                {/* Cancel */}
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="py-3 items-center"
                >
                  <Text className="text-gray-600 font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Select Protocol Substance */}
            {currentStep === 2 && logType === "protocol" && (
              <View className="gap-4">
                {protocolGroups.map((group) => (
                  <Card key={group.protocol.id}>
                    <View className="bg-gray-50 -mx-4 -mt-4 px-4 py-3 mb-3 border-b border-gray-100 rounded-t-xl">
                      <Text className="font-medium text-gray-900">
                        {group.protocol.name || "Unnamed Protocol"}
                      </Text>
                    </View>
                    {group.substances.map((ps, index) => (
                      <TouchableOpacity
                        key={ps.id}
                        onPress={() => handleSelectProtocolSubstance(ps)}
                        className={`flex-row items-center py-3 ${
                          index < group.substances.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center">
                          <Ionicons name="flask" size={20} color="#BE3455" />
                        </View>
                        <View className="ml-3 flex-1">
                          <Text className="font-medium text-gray-900">
                            {ps.substance.name}
                          </Text>
                          <Text className="text-gray-500 text-sm">
                            {ps.dose} {ps.doseUnit || ps.substance.doseUnit} •{" "}
                            {ps.frequency?.replace("_", " ") || "as needed"}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    ))}
                  </Card>
                ))}

                <TouchableOpacity
                  onPress={handleBack}
                  className="py-3 px-4 border border-gray-300 rounded-lg items-center"
                >
                  <Text className="text-gray-700 font-medium">Back</Text>
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
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-white"
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                />

                <View className="flex-row flex-wrap gap-2">
                  {filteredSubstances.map((substance) => (
                    <TouchableOpacity
                      key={substance.id}
                      onPress={() => handleSelectAdHocSubstance(substance)}
                      className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                    >
                      <Text className="text-gray-700 text-sm">{substance.name}</Text>
                    </TouchableOpacity>
                  ))}
                  {filteredSubstances.length === 0 && adHocSearch && (
                    <Text className="text-gray-500 text-sm py-4">
                      No substances found matching "{adHocSearch}"
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleBack}
                  className="py-3 px-4 border border-gray-300 rounded-lg items-center"
                >
                  <Text className="text-gray-700 font-medium">Back</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Enter Dose Details */}
            {currentStep === 3 && (
              <View className="gap-4">
                {/* Selected item header */}
                <Card className="bg-primary-50 border-primary-200">
                  <View>
                    <Text className="text-primary-600 text-sm font-medium">
                      {logType === "protocol" ? "Protocol Dose" : "Quick Log"}
                    </Text>
                    <Text className="font-semibold text-gray-900 text-lg">
                      {logType === "protocol" && selectedProtocolSubstance
                        ? selectedProtocolSubstance.substance.name
                        : selectedSubstance?.name}
                    </Text>
                    {logType === "protocol" && selectedProtocolSubstance && (
                      <Text className="text-gray-500 text-sm">
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
                  <Text className="text-gray-700 mb-2 font-medium text-sm">Unit</Text>
                  <View className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-100">
                    <Text className="text-gray-600">{currentDoseUnit}</Text>
                  </View>
                </View>

                {logType === "protocol" && selectedProtocolSubstance && (
                  <Text className="text-gray-500 text-xs -mt-2">
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

                <View className="flex-row gap-3 pt-2">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg items-center"
                  >
                    <Text className="text-gray-700 font-medium">Back</Text>
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
