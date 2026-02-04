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
import { useSubstances, useCreateProtocol } from "../../../src/hooks";
import { Card, Button, Input } from "../../../src/components/ui";

type Step = "substance" | "details";

interface Substance {
  id: string;
  name: string;
  aliases?: string[];
  defaultDose: number | string | null;
  doseUnit: string | null;
  administrationRoute: string | null;
  defaultFrequency?: string;
  category?: {
    displayName: string;
  };
}

const FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "2x_daily", label: "2x Daily" },
  { value: "3x_weekly", label: "3x Weekly" },
  { value: "weekly", label: "Weekly" },
  { value: "as_needed", label: "As Needed" },
];

const DOSE_UNITS = [
  { value: "mcg", label: "mcg" },
  { value: "mg", label: "mg" },
  { value: "ml", label: "ml" },
  { value: "iu", label: "IU" },
  { value: "units", label: "units" },
];

export default function CreateProtocolScreen() {
  const router = useRouter();
  const { data: substances, isLoading } = useSubstances();
  const createProtocol = useCreateProtocol();

  // Step state
  const [step, setStep] = useState<Step>("substance");

  // Substance selection state
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(null);
  const [substanceSearch, setSubstanceSearch] = useState("");

  // Protocol details state
  const [protocolName, setProtocolName] = useState("");
  const [dose, setDose] = useState("");
  const [doseUnit, setDoseUnit] = useState("mcg");
  const [frequency, setFrequency] = useState("daily");
  const [startDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  // Filter substances by search
  const filteredSubstances = useMemo(() => {
    if (!substances) return [];
    if (!substanceSearch.trim()) return substances.slice(0, 30);
    const search = substanceSearch.toLowerCase();
    return substances.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.aliases?.some((a) => a.toLowerCase().includes(search))
    );
  }, [substances, substanceSearch]);

  const handleSelectSubstance = (substance: Substance) => {
    setSelectedSubstance(substance);
    // Pre-fill defaults from substance
    if (substance.defaultDose) {
      setDose(String(substance.defaultDose));
    }
    if (substance.doseUnit) {
      setDoseUnit(substance.doseUnit);
    }
    if (substance.defaultFrequency) {
      setFrequency(substance.defaultFrequency);
    }
    // Suggest protocol name
    setProtocolName(`${substance.name} Protocol`);
    setStep("details");
  };

  const handleBack = () => {
    if (step === "details") {
      setStep("substance");
    } else {
      router.back();
    }
  };

  const handleCreateProtocol = async () => {
    if (!selectedSubstance || !dose) return;

    try {
      await createProtocol.mutateAsync({
        source: "custom",
        name: protocolName || undefined,
        startDate,
        substances: [
          {
            substanceId: selectedSubstance.id,
            dose: parseFloat(dose),
            doseUnit,
            frequency,
          },
        ],
        notes: notes || undefined,
      });

      Alert.alert("Protocol Created", "Your custom protocol has been created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(app)"),
        },
      ]);
    } catch {
      Alert.alert("Error", "Failed to create protocol. Please try again.");
    }
  };

  const stepLabels = ["Select Substance", "Protocol Details"];
  const currentStepIndex = step === "substance" ? 0 : 1;

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
              <Text className="text-xl font-bold text-gray-100">Create Protocol</Text>
            </View>
            <Text className="text-sm text-gray-400">
              Step {currentStepIndex + 1} of 2
            </Text>
          </View>

          {/* Step Progress Bar */}
          <View className="px-5 pb-4">
            <View className="flex-row gap-2 mb-2">
              {[0, 1].map((stepIdx) => (
                <View
                  key={stepIdx}
                  className={`flex-1 h-1.5 rounded-full ${
                    stepIdx <= currentStepIndex ? "bg-primary-500" : "bg-surface-border"
                  }`}
                />
              ))}
            </View>
            <Text className="text-gray-400 text-sm">
              {stepLabels[currentStepIndex]}
            </Text>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#39FF14" />
            <Text className="text-gray-400 mt-4">Loading substances...</Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Step 1: Select Substance */}
            {step === "substance" && (
              <View className="gap-4">
                <Text className="text-gray-300 mb-2">
                  Select a substance to create a protocol for:
                </Text>

                {/* Search Input */}
                <View className="relative mb-2">
                  <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Ionicons name="search" size={18} color="#6B7280" />
                  </View>
                  <TextInput
                    placeholder="Search substances..."
                    value={substanceSearch}
                    onChangeText={setSubstanceSearch}
                    className="border border-surface-border rounded-lg pl-11 pr-4 py-3 bg-surface-raised text-gray-100"
                    placeholderTextColor="#6B7280"
                  />
                </View>

                {/* Substance List */}
                {filteredSubstances.length === 0 ? (
                  <View className="py-8 items-center">
                    <Ionicons name="flask-outline" size={48} color="#6B7280" />
                    <Text className="text-gray-400 mt-4 text-center">
                      {substanceSearch
                        ? `No substances found matching "${substanceSearch}"`
                        : "No substances available"}
                    </Text>
                  </View>
                ) : (
                  <View className="gap-2">
                    {filteredSubstances.map((substance) => (
                      <TouchableOpacity
                        key={substance.id}
                        onPress={() => handleSelectSubstance(substance)}
                        className={`p-4 rounded-xl border-2 ${
                          selectedSubstance?.id === substance.id
                            ? "border-primary-500 bg-primary-500/10"
                            : "border-surface-border bg-surface-card"
                        }`}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1">
                            <Text className="font-medium text-gray-100 text-base">
                              {substance.name}
                            </Text>
                            {substance.category?.displayName && (
                              <Text className="text-gray-400 text-sm mt-1">
                                {substance.category.displayName}
                              </Text>
                            )}
                          </View>
                          {selectedSubstance?.id === substance.id && (
                            <Ionicons name="checkmark-circle" size={24} color="#39FF14" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => router.back()}
                  className="py-3 items-center mt-4"
                >
                  <Text className="text-gray-400 font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Protocol Details */}
            {step === "details" && selectedSubstance && (
              <View className="gap-4">
                {/* Selected Substance Summary */}
                <Card className="bg-primary-500/10 border-primary-500/30">
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-primary-500/20 items-center justify-center">
                      <Ionicons name="flask" size={20} color="#39FF14" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="text-primary-400 text-sm font-medium">
                        Selected Substance
                      </Text>
                      <Text className="font-semibold text-gray-100 text-lg">
                        {selectedSubstance.name}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setStep("substance")}>
                      <Text className="text-primary-400 text-sm">Change</Text>
                    </TouchableOpacity>
                  </View>
                </Card>

                {/* Protocol Name */}
                <Input
                  label="Protocol Name (optional)"
                  value={protocolName}
                  onChangeText={setProtocolName}
                  placeholder="e.g., My BPC-157 Protocol"
                />

                {/* Dose Amount */}
                <View>
                  <Text className="text-gray-300 mb-2 font-medium text-sm">Dose Amount</Text>
                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <TextInput
                        value={dose}
                        onChangeText={setDose}
                        keyboardType="decimal-pad"
                        placeholder="Enter dose"
                        className="border border-surface-border rounded-lg px-4 py-3 bg-surface-raised text-gray-100"
                        placeholderTextColor="#6B7280"
                      />
                    </View>
                    <View className="w-24">
                      <View className="border border-surface-border rounded-lg bg-surface-raised">
                        {DOSE_UNITS.map((unit, index) => (
                          <TouchableOpacity
                            key={unit.value}
                            onPress={() => setDoseUnit(unit.value)}
                            className={`px-3 py-2 ${
                              doseUnit === unit.value ? "bg-primary-500/20" : ""
                            } ${index !== DOSE_UNITS.length - 1 ? "border-b border-surface-border" : ""}`}
                            style={{ display: doseUnit === unit.value || index === 0 ? "flex" : "none" }}
                          >
                            <Text
                              className={`text-center ${
                                doseUnit === unit.value ? "text-primary-400" : "text-gray-300"
                              }`}
                            >
                              {unit.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Dose Unit Selector (expandable) */}
                <View>
                  <Text className="text-gray-300 mb-2 font-medium text-sm">Unit</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {DOSE_UNITS.map((unit) => (
                      <TouchableOpacity
                        key={unit.value}
                        onPress={() => setDoseUnit(unit.value)}
                        className={`px-4 py-2.5 rounded-lg border ${
                          doseUnit === unit.value
                            ? "border-primary-500 bg-primary-500/20"
                            : "border-surface-border bg-surface-card"
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            doseUnit === unit.value ? "text-primary-400" : "text-gray-300"
                          }`}
                        >
                          {unit.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Frequency */}
                <View>
                  <Text className="text-gray-300 mb-2 font-medium text-sm">Frequency</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {FREQUENCIES.map((freq) => (
                      <TouchableOpacity
                        key={freq.value}
                        onPress={() => setFrequency(freq.value)}
                        className={`px-4 py-2.5 rounded-lg border ${
                          frequency === freq.value
                            ? "border-primary-500 bg-primary-500/20"
                            : "border-surface-border bg-surface-card"
                        }`}
                      >
                        <Text
                          className={`font-medium ${
                            frequency === freq.value ? "text-primary-400" : "text-gray-300"
                          }`}
                        >
                          {freq.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Notes */}
                <Input
                  label="Notes (optional)"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any notes about this protocol..."
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="min-h-[80px]"
                />

                {/* Action Buttons */}
                <View className="flex-row gap-3 pt-4">
                  <TouchableOpacity
                    onPress={handleBack}
                    className="flex-1 py-3 px-4 border border-surface-border rounded-lg items-center"
                  >
                    <Text className="text-gray-300 font-medium">Back</Text>
                  </TouchableOpacity>
                  <Button
                    onPress={handleCreateProtocol}
                    loading={createProtocol.isPending}
                    disabled={!dose}
                    className="flex-1"
                  >
                    Create Protocol
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
