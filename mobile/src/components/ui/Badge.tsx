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
    active: "bg-green-900/40",
    paused: "bg-amber-900/40",
    completed: "bg-surface-elevated",
    default: "bg-surface-elevated",
  };

  const textClasses: Record<BadgeVariant, string> = {
    active: "text-green-400",
    paused: "text-amber-400",
    completed: "text-gray-400",
    default: "text-gray-400",
  };

  return (
    <View className={`px-2 py-1 rounded-full ${variantClasses[variant]} ${className}`}>
      <Text className={`text-xs font-medium ${textClasses[variant]}`}>
        {children}
      </Text>
    </View>
  );
}
