import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends Omit<TouchableOpacityProps, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses = "items-center justify-center rounded-lg";

  const sizeClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-3",
    lg: "px-6 py-4",
  };

  const variantClasses = {
    primary: "bg-primary-500",
    secondary: "bg-gray-600",
    outline: "border-2 border-primary-500 bg-transparent",
    ghost: "bg-transparent",
  };

  const textColors = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-primary-500",
    ghost: "text-primary-500",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${isDisabled ? "opacity-50" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "secondary" ? "#fff" : "#BE3455"}
        />
      ) : (
        <Text
          className={`font-semibold ${textColors[variant]} ${textSizes[size]}`}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}
