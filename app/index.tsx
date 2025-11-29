import React, { useState } from "react";
import { Text, View, ActivityIndicator, Pressable } from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../components/ScreenContainer";
import PrimaryButton from "../components/PrimaryButton";
import ChoreList from "../components/ChoreList";
import { useChores } from "../hooks/useChores";
// import { colors } from "../constants/colors";
export default function HomeScreen() {
  const router = useRouter();
  const { chores, loading, error, toggleChoreDone } = useChores();
  const [showActive, setShowActive] = useState(true);


  return (
    <ScreenContainer className={`pt-12 bg-[#faedcd]`}>
      

      <View className="flex-row gap-x-2 mb-4">
        <Pressable
          className={`flex-1 rounded-full py-4 px-3 text-black  ${
            showActive ? "bg-[#ccd5ae]" : "bg-transparent border-2 border-[#d4a373]"
          }`}
          onPress={() => setShowActive(true)}
        >
          <Text className={`text-center text-base font-semibold ${
            showActive ? "text-black" : "text-[#d4a373]"
          }`}>
            Active
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 rounded-full py-4 px-3 ${
            !showActive ? "bg-[#ccd5ae]" : "bg-transparent border-2 border-[#d4a373]"
          }`}
          onPress={() => setShowActive(false)}
        >
          <Text className={`text-center text-base font-semibold ${
            !showActive ? "text-black" : "text-[#d4a373]"
          }`}>
            Completed
          </Text>
        </Pressable>
      </View>

      <View>
        <Text className="text-black text-lg font-medium mb-2">
          {/* display the today date */}
          12/02/2025
          </Text>
      </View>

      {loading && (
        <View className="items-center justify-center mt-6">
          <ActivityIndicator size="small" />
          <Text className="text-black text-xs mt-2">
            Loading chores…
          </Text>
        </View>
      )}

      {error && !loading && (
        <Text className="text-[#bf4342] text-sm mb-3">
          Could not load chores: {error}
        </Text>
      )}

      {!loading && (
        <ChoreList
        
          chores={showActive ? chores.filter((c) => !c.isDone) : chores.filter((c) => c.isDone)}
          onToggleDone={toggleChoreDone}
          emptyMessage={showActive ? 'No chores yet. Tap "Add chore" to create one.' : "No completed chores yet."}
        />
      )}

      <View className="mt-auto text-black">
        
        {/* <PrimaryButton
          label="Add chore"
          onPress={() => router.push("/chore-form")}
        /> */}

         <View className="flex-row gap-x-3 mt-3">
          <PrimaryButton
            label="Add chore"
            variant="primary"
            onPress={() => router.push("/chore-form")}
            className="flex-1"
          />
          <PrimaryButton
            label="Add roomates"
            variant="primary"
            onPress={() => router.push("/setting")}
            className="flex-1"
          />
        </View>

        
        <View className="flex-row gap-x-3 mt-3">
          <PrimaryButton
            label="View history"
            variant="secondary"
            onPress={() => router.push("/history")}
            className="flex-1"
          />
          <PrimaryButton
            label="View Calendar"
            variant="secondary"
            onPress={() => router.push("/")}
            className="flex-1"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
