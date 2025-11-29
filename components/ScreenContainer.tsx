import React, { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function ScreenContainer({
  children,
  className,
}: ScreenContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#faedcd]">
      <View className={["flex-1 px-4 pb-2", className].filter(Boolean).join(" ")}>
        {children}
      </View>
    </SafeAreaView>
  );
}
