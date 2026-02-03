import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName = "",
  className = "",
  ...props
}: InputProps) {
  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-gray-300 mb-2 font-medium text-sm">{label}</Text>
      )}
      <TextInput
        className={`border rounded-lg px-4 py-3 text-gray-100 bg-surface-raised ${
          error ? "border-red-500" : "border-surface-border"
        } ${className}`}
        placeholderTextColor="#6B7280"
        {...props}
      />
      {error && <Text className="text-red-400 text-sm mt-1">{error}</Text>}
    </View>
  );
}
