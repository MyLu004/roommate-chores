import React, { useMemo } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import { useChores } from "../hooks/useChores";

export default function HistoryScreen() {
  const { chores, loading, error } = useChores();

  const completedChores = useMemo(
    () => chores.filter((c) => c.isDone),
    [chores]
  );

  return (
    <ScreenContainer className="pt-12 bg-[#faedcd]">
      <Text className="text-black text-2xl font-bold mb-2">
        Chore history
      </Text>
      <Text className="text-slate-800 text-sm mb-6">
        Recently completed chores across your household.
      </Text>

      {loading && (
        <View className="flex-row items-center mb-3">
          <ActivityIndicator size="small" />
          <Text className="text-slate-800 text-xs ml-2">
            Loading history…
          </Text>
        </View>
      )}

      {error && !loading && (
        <Text className="text-[#e26d5c] text-sm mb-3">
          Could not load chores: {error}
        </Text>
      )}

      {!loading && (
        <FlatList
          data={completedChores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-[#a98467] rounded-2xl px-4 py-3 mb-3">
              <Text className="text-[#fefae0] text-base font-semibold">
                {item.title}
              </Text>
              <View className="flex-row justify-between mt-1">
                <Text className="text-[#fefae0] text-sm">
                  {item.assigneeName}
                </Text>
                <Text className="text-[#fefae0] text-sm">
                  {item.dueLabel}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-slate-400 text-center mt-10">
              No completed chores yet.
            </Text>
          }
        />
      )}
    </ScreenContainer>
  );
}
