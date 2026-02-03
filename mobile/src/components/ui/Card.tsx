import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <View
      className={`bg-surface-card rounded-xl p-4 border border-surface-border ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
