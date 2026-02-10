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

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    // Validation
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 12) {
      setError("Password must be at least 12 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register({
        email,
        password,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      });
      router.replace("/(app)");
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data?.error;
      const details = axiosError.response?.data?.details;

      if (details && details.length > 0) {
        setError(details.map((d) => d.message).join(". "));
      } else {
        setError(errorMessage || "Registration failed. Please try again.");
      }
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
          <View className="flex-1 px-6 pt-8 pb-8">
            {/* Logo/Branding */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-primary-500">
                BioStak
              </Text>
              <Text className="text-gray-500 mt-2">
                The biohacker's health tracking tool
              </Text>
            </View>

            {/* Welcome Text */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-100">
                Create your account
              </Text>
              <Text className="text-gray-400 mt-1">
                Start tracking your peptide therapy journey
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
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="John"
                    textContentType="givenName"
                    autoCapitalize="words"
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Doe"
                    textContentType="familyName"
                    autoCapitalize="words"
                  />
                </View>
              </View>

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
                placeholder="At least 12 characters"
                textContentType="newPassword"
              />

              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Re-enter your password"
                textContentType="newPassword"
              />

              <Text className="text-gray-400 text-xs mb-4">
                Password must be at least 12 characters with 1 uppercase letter
                and 1 special character.
              </Text>

              <Button onPress={handleRegister} loading={loading}>
                Create Account
              </Button>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-400">Already have an account? </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-primary-500 font-semibold">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
