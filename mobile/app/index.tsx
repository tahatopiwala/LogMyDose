import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../src/contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.replace("/(app)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isLoading, isAuthenticated]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#BE3455" />
    </View>
  );
}
