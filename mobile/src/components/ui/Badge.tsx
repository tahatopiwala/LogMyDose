import React from "react";
import { View, Text } from "react-native";

type BadgeVariant = "active" | "paused" | "completed" | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    active: "bg-green-100",
    paused: "bg-yellow-100",
    completed: "bg-gray-100",
    default: "bg-gray-100",
  };

  const textClasses: Record<BadgeVariant, string> = {
    active: "text-green-800",
    paused: "text-yellow-800",
    completed: "text-gray-800",
    default: "text-gray-800",
  };

  return (
    <View className={`px-2 py-1 rounded-full ${variantClasses[variant]} ${className}`}>
      <Text className={`text-xs font-medium ${textClasses[variant]}`}>
        {children}
      </Text>
    </View>
  );
}
