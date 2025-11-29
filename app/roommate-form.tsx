import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Pressable,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../components/ScreenContainer";
import PrimaryButton from "../components/PrimaryButton";
import { useHousehold } from "../hooks/useHousehold";

const PRESET_COLORS = [
  { name: "Emerald", hex: "#10b981" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Orange", hex: "#f97316" },
];

export default function RoommateFormScreen() {
  const router = useRouter();
  const { addRoommate } = useHousehold();

  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a roommate name.");
      return;
    }

    setSaving(true);
    try {
      const colorToSave = customColor.trim() || selectedColor;
      await addRoommate(name.trim(), colorToSave || undefined);
      router.back();
    } catch (e) {
      console.error(e);
      alert("Something went wrong while saving the roommate.");
    } finally {
      setSaving(false);
    }
  };

  const activeColor = customColor.trim() || selectedColor;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-900"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenContainer className="pt-12 bg-[#faedcd]">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-black text-2xl font-bold mb-6">
            Add roommate
          </Text>

          {/* Name Input */}
          <View className="mb-6">
            <Text className="text-slate-800 text-sm mb-2">
              Roommate name
            </Text>
            <TextInput
              className="bg-[#fefae0] rounded-xl px-4 py-5 text-slate-700"
              placeholder="e.g. Alex"
              placeholderTextColor="#64748b"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Color Selection */}
          <View className="mb-6">
            <Text className="text-slate-800 text-sm mb-3">
              Color
            </Text>

            {/* Preset Colors */}
            <View className="flex-row gap-x-3 mb-3">
              {PRESET_COLORS.map((color) => (
                <Pressable
                  key={color.hex}
                  onPress={() => {
                    setSelectedColor(color.hex);
                    setCustomColor("");
                  }}
                  className={`w-12 h-12 rounded-lg ${
                    activeColor === color.hex
                      ? "border-white"
                      : "border-slate-600"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {activeColor === color.hex && (
                    <View className="flex-1 items-center justify-center">
                      <Text className="text-white text-lg font-bold">✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}

              {/* Custom Color Button */}
              <Pressable
                onPress={() => setShowColorPicker(true)}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-400 items-center justify-center bg-slate-800"
              >
                <Text className="text-slate-300 text-xl font-bold">+</Text>
              </Pressable>
            </View>

            {/* Custom Color Input */}
            {customColor && (
              <View className="flex-row items-center gap-x-2">
                <View
                  className="w-10 h-10 rounded-lg border border-[slate-400]"
                  style={{ backgroundColor: customColor }}
                />
                <TextInput
                  className="flex-1 bg-[#d4a373] rounded-lg px-3 py-2 text-slate-50 text-sm"
                  placeholder="#RRGGBB"
                  placeholderTextColor="#64748b"
                  value={customColor}
                  onChangeText={setCustomColor}
                />
              </View>
            )}
          </View>

          {/* Color Picker Modal */}
          <Modal
            visible={showColorPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowColorPicker(false)}
          >
            <View className="flex-1 bg-black/50 justify-end">
              <View className="bg-[#956434] rounded-t-3xl p-6">
                <Text className="text-slate-50 text-lg font-bold mb-4">
                  Custom color
                </Text>
                <Text className="text-[#fefae0] text-sm mb-3">
                  Enter a hex color code (e.g. #FF5733)
                </Text>
                <TextInput
                  className="bg-[#faedcd] rounded-lg px-4 py-3 text-slate-800 mb-4"
                  placeholder="#RRGGBB"
                  placeholderTextColor="#64748b"
                  value={customColor}
                  onChangeText={setCustomColor}
                />

                {customColor && (
                  <View
                    className="h-16 rounded-lg mb-4 border border-slate-600"
                    style={{ backgroundColor: customColor }}
                  />
                )}

                <View className="flex-row gap-x-3">
                  <PrimaryButton
                    label="Save"
                    onPress={() => {
                      setShowColorPicker(false);
                      setSelectedColor(null);
                    }}
                    className="flex-1"
                  />
                  <PrimaryButton
                    label="Cancel"
                    variant="secondary"
                    onPress={() => {
                      setShowColorPicker(false);
                      setCustomColor("");
                    }}
                    className="flex-1"
                  />
                </View>
              </View>
            </View>
          </Modal>

          {saving && (
            <View className="flex-row items-center mb-3">
              <ActivityIndicator size="small" />
              <Text className="text-slate-400 text-xs ml-2">
                Saving roommate…
              </Text>
            </View>
          )}

          <View className="flex-row gap-x-3">
            <PrimaryButton
              label="Save roommate"
              onPress={handleSave}
              className="flex-1"
              disabled={saving}
            />
            <PrimaryButton
              label="Cancel"
              variant="secondary"
              onPress={() => router.back()}
              className="flex-1"
              disabled={saving}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
