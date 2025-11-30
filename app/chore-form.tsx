import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenContainer from "../components/ScreenContainer";
import PrimaryButton from "../components/PrimaryButton";
import Avatar from "../components/Avatar";
import { useChores } from "../hooks/useChores";
import { useHousehold } from "../hooks/useHousehold";
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';

export default function ChoreFormScreen() {
  const router = useRouter();
  const { addChore } = useChores();
  const { roommates, loading: roommatesLoading } = useHousehold();

  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [assigneeName, setAssigneeName] = useState("");
  const [assigneeColor, setAssigneeColor] = useState<string | null>(null);
  const [due, setDue] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const handleConfirmDate = (date: Date | undefined) => {
    if (date !== undefined) {
      setDueDate(date);
      setDue(date.toLocaleDateString());
    }
    setDatePickerVisibility(false);
  };

  const handleCancelDate = () => {
    setDatePickerVisibility(false);
  };
  const [saving, setSaving] = useState(false);
  const [showRoommatePicker, setShowRoommatePicker] = useState(false);

  const handleSelectRoommate = (id: string, name: string, color: string | null) => {
    setAssigneeId(id);
    setAssigneeName(name);
    setAssigneeColor(color);
    setShowRoommatePicker(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Please enter a chore name.");
      return;
    }

    setSaving(true);
    try {
      await addChore({
        title: title.trim(),
        assigneeName: assigneeName || "Unassigned",
        assigneeId: assigneeId || undefined,
        assigneeColor: assigneeColor || undefined,
        dueLabel: due.trim() || "Anytime",
      });
      router.back();
    } catch (e) {
      console.error(e);
      alert("Something went wrong while saving the chore.");
    } finally {
      setSaving(false);
    }
  };

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
            Add new chore
          </Text>

          <View className="mb-4">
            <Text className="text-black text-base mb-1">
              Chore name
            </Text>
            <TextInput
              className="bg-[#fefae0] rounded-xl px-4 py-6 "
              placeholder="e.g. Take out trash"
              placeholderTextColor="#573b1fff"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View className="mb-4">
            <Text className="text-black text-base mb-1">
              Assigned to
            </Text>
            <Pressable
              onPress={() => setShowRoommatePicker(true)}
              className="bg-[#fefae0] rounded-xl px-4 py-6"
            >
              <Text className="text-black">
                {assigneeName || "Select a roommate"}
              </Text>
            </Pressable>
          </View>

          {/* Roommate Picker Modal */}
          <Modal
            visible={showRoommatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowRoommatePicker(false)}
          >
            <View className="flex-1 bg-black/50 justify-end">
              <View className="bg-[#fefae0] rounded-t-3xl p-6">
                <Text className="text-black text-lg font-bold mb-4">
                  Select roommate
                </Text>
                <FlatList
                  data={roommates}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() =>
                        handleSelectRoommate(item.id, item.name, item.color || null)
                      }
                      className="flex-row items-center bg-white rounded-lg px-4 py-3 mb-2"
                    >
                      <Avatar name={item.name} size="sm" colorHex={item.color} />
                      <Text className="text-black text-base ml-3">
                        {item.name}
                      </Text>
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    <Text className="text-black text-center py-4">
                      No roommates. Add one in Settings.
                    </Text>
                  }
                />
                <PrimaryButton
                  label="Unassigned"
                  variant="secondary"
                  onPress={() => handleSelectRoommate("", "Unassigned", null)}
                />
              </View>
            </View>
          </Modal>

          <View className="mb-8">
            <Text className="text-black text-base mb-1">Due</Text>
            <View className="flex-row items-center">
              <TextInput
                className="bg-[#fefae0] rounded-xl px-4 py-6 flex-1"
                placeholder="Pick a date or type manually"
                placeholderTextColor="#64748b"
                value={due}
                onChangeText={setDue}
              />
              <Pressable
                onPress={() => setDatePickerVisibility(true)}
                className="ml-2"
                accessibilityLabel="Pick due date"
              >
                <MaterialIcons name="calendar-today" size={28} color="#573b1f" />
              </Pressable>
            </View>
            {Platform.OS === 'ios' || Platform.OS === 'android' 
            ? <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirmDate}
              onCancel={handleCancelDate}
            /> 
            : <DatePickerModal 
              visible={isDatePickerVisible}
              locale="en"
              mode="single"
              onConfirm={params => handleConfirmDate(params.date)}
              onDismiss={handleCancelDate}
            />}
          </View>

          {saving && (
            <View className="flex-row items-center mb-3">
              <ActivityIndicator size="small" />
              <Text className="text-slate-400 text-xs ml-2">
                Saving chore…
              </Text>
            </View>
          )}

          <View className="flex-row gap-x-3">
            <PrimaryButton
              label="Save chore"
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
