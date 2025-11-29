import React from "react";
import { View, Text, Pressable } from "react-native";
import Avatar from "./Avatar";

export type ChoreCardProps = {
  title: string;
  assigneeName: string;
  dueLabel: string;
  isDone: boolean;
  assigneeColor?: string | null; // Color hex code from roommate
  onToggleDone?: () => void;
};

export default function ChoreCard({
  title,
  assigneeName,
  dueLabel,
  isDone,
  assigneeColor,
  onToggleDone,
}: ChoreCardProps) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-[#a98467] px-4 py-3 mb-3">
      <View className="flex-row items-center flex-1 mr-3">
        <Avatar name={assigneeName} size="md" colorHex={assigneeColor} />
        <View className="ml-3 flex-1">
          <Text className="text-white font-semibold text-base">
            {title}
          </Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-sm text-[#fefae0] mr-2">
              {assigneeName}
            </Text>
            <Text className="text-sm text-[#fefae0]">
              {dueLabel}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        className={`w-8 h-8 rounded-full border-2 items-center justify-center ${
          isDone
            ? "bg-[#ccd5ae] border-[#ccd5ae]"
            : "border-[#fefae0]"
        }`}
        onPress={onToggleDone}
      >
        {isDone && (
          <Text className="text-[#271e16] text-xs font-bold">✓</Text>
        )}
      </Pressable>
    </View>
  );
}
