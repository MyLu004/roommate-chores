import React from "react";
import { FlatList, Text, ListRenderItem } from "react-native";
import ChoreCard, { ChoreCardProps } from "./ChoreCard";

export type Chore = ChoreCardProps & { id: string };

type ChoreListProps = {
  chores: Chore[];
  onToggleDone?: (id: string) => void;
  emptyMessage?: string;
};

export default function ChoreList({
  chores,
  onToggleDone,
  emptyMessage = 'No chores yet. Tap "Add chore" to create one.',
}: ChoreListProps) {
  const renderItem: ListRenderItem<Chore> = ({ item }) => (
    <ChoreCard
      title={item.title}
      assigneeName={item.assigneeName}
      assigneeColor={item.assigneeColor}
      dueLabel={item.dueLabel}
      isDone={item.isDone}
      onToggleDone={() => onToggleDone?.(item.id)}
    />
  );

  return (
    <FlatList
      data={chores}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 16 }}
      ListEmptyComponent={
        <Text className="text-black font-semibold text-bold text-center mt-10">
          {emptyMessage}
        </Text>
      }
    />
  );
}
