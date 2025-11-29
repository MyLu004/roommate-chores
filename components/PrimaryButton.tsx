import React from "react";
import { Pressable, Text, GestureResponderEvent } from "react-native";

type PrimaryButtonProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
};

export default function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  className,
}: PrimaryButtonProps) {
  const base =
    "w-full rounded-2xl py-3 items-center justify-center active:opacity-80";
  const variants: Record<typeof variant, string> = {
    primary: "bg-[#ccd5ae]",
    secondary: " bg-[#d4a373]",
    ghost: "bg-transparent",
  };
  const disabledStyles = disabled ? "opacity-50 active:opacity-50" : "";

  return (
    <Pressable
      className={[base, variants[variant], disabledStyles, className]
        .filter(Boolean)
        .join(" ")}
      onPress={disabled ? undefined : onPress}
    >
      <Text
        className={
          variant === "primary"
            ? "text-black font-semibold text-base"
            : "text-black font-medium text-base"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
