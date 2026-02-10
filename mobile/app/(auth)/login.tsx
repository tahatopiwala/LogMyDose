import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/contexts/AuthContext";
import { Button, Input } from "../../src/components/ui";
import { AxiosError } from "axios";
import { ApiError } from "../../src/types/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login({ email, password });
      router.replace("/(app)");
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      setError(
        axiosError.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-base">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 pt-12 pb-8 justify-center">
            {/* Logo/Branding */}
            <View className="items-center mb-10">
              <Text className="text-3xl font-bold text-primary-500">
                BioStak
              </Text>
              <Text className="text-gray-500 mt-2">
                The biohacker's health tracking tool
              </Text>
            </View>

            {/* Welcome Text */}
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-100">
                Welcome back
              </Text>
              <Text className="text-gray-400 mt-1">
                Sign in to continue tracking your doses
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
                <Text className="text-red-400 text-sm">{error}</Text>
              </View>
            ) : null}

            {/* Form */}
            <View>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="you@example.com"
                textContentType="emailAddress"
              />

              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
                textContentType="password"
              />

              <Button onPress={handleLogin} loading={loading} className="mt-2">
                Sign In
              </Button>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-400">Don't have an account? </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-500 font-semibold">
                    Sign up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
