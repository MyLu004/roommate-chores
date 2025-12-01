// app/_layout.tsx
import "./global.css";
import { Stack, useRouter } from "expo-router";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";

import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// 🔹 Custom circle back button component
function CircleBackButton() {
  const router = useRouter();

  

  return (
    <Pressable
      onPress={() => router.back()}
      style={{
        marginLeft: 20,
        marginRight: 15,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.2)", // tweak color here
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name="chevron-back" size={18} color="white" />
    </Pressable>
  );
}

// styling the web calender.
    const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: "#573b1f",        // header / selected date color
      primaryContainer: "#fefae0",
      surface: "#fefae0",        // dialog background
      background: "#faedcd",     // app background
      onSurface: "#000000",      // text color inside calendar
    },
  };

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "#da0000ff",
        },
        headerStyle: {
          backgroundColor: "#d4a373",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          
        },
        headerTitleAlign: "center",
        // hide default back text (iOS)
        headerBackTitleStyle: false,
        // hide default back icon; we’ll use headerLeft instead
        headerBackVisible: false,
      }}
    >
      {/* Root screen – no custom back button */}
      <Stack.Screen
        name="index"
        options={{ title: "Today Chores" }}
      />

      {/* Add / Edit chore */}
      <Stack.Screen
        name="chore-form"
        options={{
          title: "Chores",
          headerLeft: () => <CircleBackButton />,
        }}
      />

      {/* History */}
      <Stack.Screen
        name="history"
        options={{
          title: "History",
          headerLeft: () => <CircleBackButton />,
        }}
      />

      {/* Settings / Roommates */}
      <Stack.Screen
        name="setting"
        options={{
          title: "household settings",
          headerLeft: () => <CircleBackButton />,
        }}
      />
    </Stack>
    </PaperProvider>
  );
}
