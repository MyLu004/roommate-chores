import React from "react";
import { View, Text } from "react-native";

type AvatarProps = {
  name: string;
  size?: "sm" | "md" | "lg";
  colorClassName?: string; // e.g. "bg-emerald-500" (fallback for Tailwind)
  colorHex?: string | null; // e.g. "#10b981" (from database)
};

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
  );
}

export default function Avatar({
  name,
  size = "md",
  colorClassName,
  colorHex,
}: AvatarProps) {
  const sizeClasses =
    size === "sm"
      ? "w-8 h-8"
      : size === "lg"
      ? "w-12 h-12"
      : "w-10 h-10";
  const textSize =
    size === "sm"
      ? "text-xs"
      : size === "lg"
      ? "text-base"
      : "text-sm";

  // Use hex color if available, otherwise fall back to colorClassName
  const bgColor = colorHex || undefined;

  return (
    <View
      className={`${sizeClasses} rounded-full ${colorClassName || "bg-slate-500"} items-center justify-center`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <Text className={`text-white text-base font-bold ${textSize}`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
