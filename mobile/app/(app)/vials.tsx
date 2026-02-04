import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  useVials,
  useCreateVial,
  useReconstituteVial,
  useMarkVialDepleted,
  Vial,
} from "../../src/hooks/useVials";
import { useProducts, Product } from "../../src/hooks/useProducts";
import { Card } from "../../src/components/ui";

type VialStatus = "active" | "depleted" | "expired" | "disposed";
type DiluentType = "bacteriostatic_water" | "saline" | "sterile_water";
type FilterStatus = "all" | VialStatus;

const STATUS_STYLES: Record<VialStatus, { bg: string; text: string }> = {
  active: { bg: "bg-green-500/20", text: "text-green-400" },
  depleted: { bg: "bg-gray-500/20", text: "text-gray-400" },
  expired: { bg: "bg-red-500/20", text: "text-red-400" },
  disposed: { bg: "bg-slate-500/20", text: "text-slate-400" },
};

const DILUENT_LABELS: Record<DiluentType, string> = {
  bacteriostatic_water: "Bacteriostatic Water",
  saline: "Saline",
  sterile_water: "Sterile Water",
};

export default function VialsScreen() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReconstituteModal, setShowReconstituteModal] = useState(false);
  const [selectedVial, setSelectedVial] = useState<Vial | null>(null);

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
  } = useVials({
    status: statusFilter === "all" ? undefined : statusFilter,
    limit: 50,
  });

  const vials = data?.data || [];

  const handleReconstitute = (vial: Vial) => {
    setSelectedVial(vial);
    setShowReconstituteModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-base" edges={["top"]}>
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center justify-between border-b border-surface-border">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3 p-1"
          >
            <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-100">Vials</Text>
            <Text className="text-gray-400 text-sm">
              Manage your peptide inventory
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          className="bg-primary-500 p-2 rounded-lg"
        >
          <Ionicons name="add" size={24} color="#0D0D0D" />
        </TouchableOpacity>
      </View>

      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-14 px-4 py-2 border-b border-surface-border"
        contentContainerStyle={{ gap: 8 }}
      >
        {(["all", "active", "depleted", "expired"] as FilterStatus[]).map(
          (status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-full ${
                statusFilter === status
                  ? "bg-primary-500"
                  : "bg-surface-card"
              }`}
            >
              <Text
                className={`font-medium text-sm ${
                  statusFilter === status
                    ? "text-surface-base"
                    : "text-gray-400"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      {/* Vials List */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#39FF14"
          />
        }
      >
        {isLoading ? (
          <Card className="p-8 items-center">
            <Text className="text-gray-400">Loading vials...</Text>
          </Card>
        ) : vials.length === 0 ? (
          <Card className="p-8 items-center">
            <Ionicons name="flask-outline" size={48} color="#6B7280" />
            <Text className="text-gray-300 mt-4 font-medium">No vials found</Text>
            <Text className="text-gray-500 text-sm mt-1 text-center">
              Add a vial to start tracking your inventory
            </Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              className="mt-4 bg-primary-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-surface-base font-semibold">Add Vial</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <View className="space-y-3">
            {vials.map((vial) => (
              <VialCard
                key={vial.id}
                vial={vial}
                onReconstitute={() => handleReconstitute(vial)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Modal */}
      <CreateVialModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Reconstitute Modal */}
      {selectedVial && (
        <ReconstituteModal
          visible={showReconstituteModal}
          vial={selectedVial}
          onClose={() => {
            setShowReconstituteModal(false);
            setSelectedVial(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

interface VialCardProps {
  vial: Vial;
  onReconstitute: () => void;
}

function VialCard({ vial, onReconstitute }: VialCardProps) {
  const markDepleted = useMarkVialDepleted();

  const isReconstituted = !!vial.reconstitutedAt;
  const statusStyle = STATUS_STYLES[vial.status];
  const remainingPercent =
    vial.vialAmountMcg && vial.remainingAmountMcg
      ? (Number(vial.remainingAmountMcg) / Number(vial.vialAmountMcg)) * 100
      : null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleMarkDepleted = () => {
    Alert.alert("Mark Depleted", "Mark this vial as depleted?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark Depleted",
        onPress: () => markDepleted.mutate(vial.id),
      },
    ]);
  };

  return (
    <Card className="p-4 mb-3">
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <Text className="font-semibold text-gray-100">
            {vial.product?.name || "Unknown Product"}
          </Text>
          <Text className="text-sm text-gray-500">
            {vial.product?.substance?.name || "Unknown Substance"}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${statusStyle.bg}`}>
          <Text className={`text-xs font-semibold ${statusStyle.text}`}>
            {vial.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="space-y-2">
        {vial.vialAmountMcg && (
          <View className="flex-row justify-between">
            <Text className="text-gray-400 text-sm">Vial Amount</Text>
            <Text className="text-gray-200 text-sm">{vial.vialAmountMcg} mcg</Text>
          </View>
        )}

        {isReconstituted && (
          <>
            <View className="flex-row justify-between">
              <Text className="text-gray-400 text-sm">Concentration</Text>
              <Text className="text-gray-200 text-sm">
                {vial.concentrationMcgMl} mcg/mL
              </Text>
            </View>
            {vial.remainingAmountMcg !== null && (
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-400 text-sm">Remaining</Text>
                  <Text className="text-gray-200 text-sm">
                    {vial.remainingAmountMcg} mcg
                  </Text>
                </View>
                {remainingPercent !== null && (
                  <View className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                    <View
                      className={`h-full rounded-full ${
                        remainingPercent > 50
                          ? "bg-green-500"
                          : remainingPercent > 20
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${remainingPercent}%` }}
                    />
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {vial.lotNumber && (
          <View className="flex-row justify-between">
            <Text className="text-gray-400 text-sm">Lot Number</Text>
            <Text className="text-gray-200 text-sm font-mono">{vial.lotNumber}</Text>
          </View>
        )}
      </View>

      {/* Dates */}
      <View className="mt-3 pt-3 border-t border-surface-border">
        {isReconstituted && vial.reconstitutedAt && (
          <View className="flex-row items-center mb-1">
            <Ionicons name="flask" size={12} color="#60A5FA" />
            <Text className="text-xs text-blue-400 ml-1">
              Reconstituted {formatDate(vial.reconstitutedAt)}
            </Text>
          </View>
        )}
        {(vial.calculatedExpDate || vial.manufacturerExpDate) && (
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={12} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 ml-1">
              Expires {formatDate(vial.calculatedExpDate || vial.manufacturerExpDate)}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {vial.status === "active" && (
        <View className="flex-row gap-2 mt-3">
          {!isReconstituted && (
            <TouchableOpacity
              onPress={onReconstitute}
              className="flex-1 bg-blue-500/20 py-2 rounded-lg"
            >
              <Text className="text-blue-400 text-center font-medium text-sm">
                Reconstitute
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleMarkDepleted}
            disabled={markDepleted.isPending}
            className="flex-1 bg-surface-elevated py-2 rounded-lg"
          >
            <Text className="text-gray-400 text-center font-medium text-sm">
              {markDepleted.isPending ? "..." : "Mark Depleted"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );
}

interface CreateVialModalProps {
  visible: boolean;
  onClose: () => void;
}

function CreateVialModal({ visible, onClose }: CreateVialModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [vialAmountMcg, setVialAmountMcg] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [storageLocation, setStorageLocation] = useState("");
  const [notes, setNotes] = useState("");

  const { data: products, isLoading: productsLoading } = useProducts({ limit: 100 });
  const createVial = useCreateVial();

  const handleSubmit = () => {
    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product");
      return;
    }

    createVial.mutate(
      {
        productId: selectedProduct.id,
        vialAmountMcg: vialAmountMcg ? parseFloat(vialAmountMcg) : undefined,
        lotNumber: lotNumber || undefined,
        storageLocation: storageLocation || undefined,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          handleClose();
          Alert.alert("Success", "Vial added successfully");
        },
        onError: () => {
          Alert.alert("Error", "Failed to create vial. Please try again.");
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setVialAmountMcg("");
    setLotNumber("");
    setStorageLocation("");
    setNotes("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-surface-card rounded-t-3xl p-6 max-h-[85%]">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-100">Add New Vial</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="space-y-4 pb-4">
              {/* Product Selection */}
              <View>
                <Text className="text-sm text-gray-400 mb-2">Product *</Text>
                {productsLoading ? (
                  <View className="bg-surface-elevated rounded-lg px-4 py-3">
                    <Text className="text-gray-500">Loading products...</Text>
                  </View>
                ) : !products || products.length === 0 ? (
                  <View className="bg-surface-elevated rounded-lg px-4 py-3">
                    <Text className="text-gray-500">No products available. Add a protocol first.</Text>
                  </View>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="pb-2"
                  >
                    <View className="flex-row gap-2">
                      {products.map((product) => (
                        <TouchableOpacity
                          key={product.id}
                          onPress={() => setSelectedProduct(product)}
                          className={`px-4 py-3 rounded-lg border min-w-[140px] ${
                            selectedProduct?.id === product.id
                              ? "border-primary-500 bg-primary-500/20"
                              : "border-surface-border bg-surface-elevated"
                          }`}
                        >
                          <Text
                            className={`font-medium ${
                              selectedProduct?.id === product.id
                                ? "text-primary-400"
                                : "text-gray-300"
                            }`}
                            numberOfLines={1}
                          >
                            {product.name}
                          </Text>
                          <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
                            {product.substance?.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                )}
              </View>

              {/* Vial Amount */}
              <View>
                <Text className="text-sm text-gray-400 mb-2">Vial Amount (mcg)</Text>
                <TextInput
                  value={vialAmountMcg}
                  onChangeText={setVialAmountMcg}
                  placeholder="e.g., 5000"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  className="bg-surface-elevated rounded-lg px-4 py-3 text-gray-100"
                />
              </View>

              {/* Lot Number */}
              <View>
                <Text className="text-sm text-gray-400 mb-2">Lot Number</Text>
                <TextInput
                  value={lotNumber}
                  onChangeText={setLotNumber}
                  placeholder="e.g., LOT2024A"
                  placeholderTextColor="#6B7280"
                  className="bg-surface-elevated rounded-lg px-4 py-3 text-gray-100"
                />
              </View>

              {/* Storage Location */}
              <View>
                <Text className="text-sm text-gray-400 mb-2">Storage Location</Text>
                <TextInput
                  value={storageLocation}
                  onChangeText={setStorageLocation}
                  placeholder="e.g., Main Fridge"
                  placeholderTextColor="#6B7280"
                  className="bg-surface-elevated rounded-lg px-4 py-3 text-gray-100"
                />
              </View>

              {/* Notes */}
              <View>
                <Text className="text-sm text-gray-400 mb-2">Notes</Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Any additional notes..."
                  placeholderTextColor="#6B7280"
                  multiline
                  numberOfLines={2}
                  className="bg-surface-elevated rounded-lg px-4 py-3 text-gray-100"
                />
              </View>

              {/* Submit Button */}
              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!selectedProduct || createVial.isPending}
                className={`py-4 rounded-lg mt-2 ${
                  !selectedProduct || createVial.isPending
                    ? "bg-gray-600"
                    : "bg-primary-500"
                }`}
              >
                <Text className="text-surface-base text-center font-bold">
                  {createVial.isPending ? "Creating..." : "Add Vial"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

interface ReconstituteModalProps {
  visible: boolean;
  vial: Vial;
  onClose: () => void;
}

function ReconstituteModal({ visible, vial, onClose }: ReconstituteModalProps) {
  const [diluentType, setDiluentType] = useState<DiluentType>("bacteriostatic_water");
  const [diluentVolumeMl, setDiluentVolumeMl] = useState("");

  const reconstitute = useReconstituteVial();

  const calculatedConcentration =
    vial.vialAmountMcg && diluentVolumeMl
      ? (Number(vial.vialAmountMcg) / parseFloat(diluentVolumeMl)).toFixed(2)
      : null;

  const handleSubmit = () => {
    if (!diluentVolumeMl) {
      Alert.alert("Error", "Please enter the diluent volume");
      return;
    }

    reconstitute.mutate(
      {
        id: vial.id,
        data: {
          diluentType,
          diluentVolumeMl: parseFloat(diluentVolumeMl),
        },
      },
      {
        onSuccess: () => {
          setDiluentVolumeMl("");
          onClose();
        },
      }
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-surface-card rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-100">
              Reconstitute Vial
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Vial Info */}
          <View className="bg-surface-elevated rounded-lg p-4 mb-4">
            <Text className="text-sm text-gray-400">Product</Text>
            <Text className="font-medium text-gray-100">{vial.product?.name}</Text>
            {vial.vialAmountMcg && (
              <Text className="text-sm text-gray-400 mt-2">
                Amount: <Text className="text-gray-200">{vial.vialAmountMcg} mcg</Text>
              </Text>
            )}
          </View>

          <View className="space-y-4">
            {/* Diluent Type */}
            <View>
              <Text className="text-sm text-gray-400 mb-2">Diluent Type</Text>
              <View className="space-y-2">
                {(Object.keys(DILUENT_LABELS) as DiluentType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setDiluentType(type)}
                    className={`p-3 rounded-lg border ${
                      diluentType === type
                        ? "border-primary-500 bg-primary-500/20"
                        : "border-surface-border bg-surface-elevated"
                    }`}
                  >
                    <Text
                      className={
                        diluentType === type
                          ? "text-primary-400"
                          : "text-gray-400"
                      }
                    >
                      {DILUENT_LABELS[type]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Diluent Volume */}
            <View>
              <Text className="text-sm text-gray-400 mb-2">Diluent Volume (mL)</Text>
              <TextInput
                value={diluentVolumeMl}
                onChangeText={setDiluentVolumeMl}
                placeholder="e.g., 2"
                placeholderTextColor="#6B7280"
                keyboardType="decimal-pad"
                className="bg-surface-elevated rounded-lg px-4 py-3 text-gray-100"
              />
            </View>

            {/* Calculated Concentration */}
            {calculatedConcentration && (
              <View className="bg-primary-500/10 border border-primary-500/30 rounded-lg p-4">
                <Text className="text-sm text-gray-400">Resulting Concentration</Text>
                <Text className="text-2xl font-bold text-primary-500">
                  {calculatedConcentration}{" "}
                  <Text className="text-lg">mcg/mL</Text>
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!diluentVolumeMl || reconstitute.isPending}
              className="bg-blue-500 py-4 rounded-lg"
            >
              <Text className="text-white text-center font-bold">
                {reconstitute.isPending ? "Reconstituting..." : "Reconstitute Vial"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
