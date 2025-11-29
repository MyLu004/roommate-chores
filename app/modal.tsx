import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../components/PrimaryButton";

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black/60 justify-center items-center px-6">
      <View className="w-full rounded-3xl bg-slate-900 px-5 py-6">
        <Text className="text-slate-50 text-lg font-bold mb-2">
          Example modal
        </Text>
        <Text className="text-slate-300 text-sm mb-5">
          This is a placeholder modal screen. Later, you can use a
          modal for confirming deletes, showing notes, etc.
        </Text>

        <PrimaryButton label="Close" onPress={() => router.back()} />
      </View>
    </View>
  );
}
