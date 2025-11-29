import React from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../components/ScreenContainer";
import Avatar from "../components/Avatar";
import PrimaryButton from "../components/PrimaryButton";
import { useHousehold } from "../hooks/useHousehold";

export default function SettingsScreen() {
  const router = useRouter();
  const { roommates, loading, error } = useHousehold();

  const handleAddRoommate = () => {
    router.push("/roommate-form");
  };

  return (
    <ScreenContainer className="pt-12 bg-[#faedcd]">
      <Text className="text-black text-2xl font-bold mb-2">
        Household
      </Text>
      <Text className="text-black text-sm font-semibold mb-6">
        Total roommates: {roommates.length}
      </Text>

      {loading && (
        <View className="flex-row items-center mb-3">
          <ActivityIndicator size="small" />
          <Text className="text-black text-xs ml-2">
            Loading roommates…
          </Text>
        </View>
      )}

      {error && !loading && (
        <Text className="text-black text-sm mb-3">
          Could not load roommates: {error}
        </Text>
      )}

      {/* <Text className="text-black text-sm mb-2">
        Roommates
      </Text> */}

      <FlatList
        data={roommates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-[#a98467] rounded-2xl px-4 py-3 mb-3">
            <Avatar name={item.name} size="sm" colorHex={item.color} />
            <Text className="text-[#fefae0] text-base font-medium ml-3">
              {item.name}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text className="text-black text-xs mb-3">
              No roommates yet. Add one below.
            </Text>
          ) : null
        }
      />

      <View className="mt-4">
        <PrimaryButton
          label="+ Add roommate"
          variant="primary"
          onPress={handleAddRoommate}
        />
      </View>
    </ScreenContainer>
  );
}
