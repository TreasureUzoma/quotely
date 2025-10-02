import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { HomeStyles as styles } from "../styles/home";

import { NoNotes } from "../components/no-notes";
import { useNotes } from "../hooks/use-notes";
import { useInfiniteNotes } from "../hooks/use-notes";
import { FlatList } from "react-native";

interface HeaderProps {
  title: string;
  isSelectionMode?: boolean;
  selectedCount?: number;
  onPressCancel?: () => void;
  onPressDelete?: () => void;
}

const Header = ({
  title,
  isSelectionMode,
  selectedCount,
  onPressCancel,
  onPressDelete,
}: HeaderProps) => {
  return (
    <View style={styles.headerContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isSelectionMode ? "light-content" : "dark-content"}
      />
      <View
        style={[styles.header, isSelectionMode && { backgroundColor: "#ddd" }]}
      >
        <View style={styles.headerLeft}>
          {isSelectionMode && onPressCancel && (
            <TouchableOpacity
              onPress={onPressCancel}
              style={styles.headerButton}
            >
              <Ionicons name="close" size={20} color="#1C2121" />
            </TouchableOpacity>
          )}
          <Text style={styles.customHeaderTitle}>
            {isSelectionMode
              ? selectedCount && selectedCount > 0
                ? `${selectedCount} items selected`
                : "Select notes"
              : title}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {isSelectionMode && onPressDelete && (
            <TouchableOpacity
              onPress={onPressDelete}
              style={styles.headerButton}
              disabled={!(selectedCount && selectedCount > 0)}
            >
              <Ionicons
                name="trash"
                size={24}
                color={
                  !(selectedCount && selectedCount > 0) ? "transparent" : "red"
                }
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const SkeletonNote = () => (
  <View style={[styles.noteCard, { backgroundColor: "#eee" }]}>
    <View
      style={{ flex: 1, height: 20, backgroundColor: "#ddd", borderRadius: 4 }}
    />
  </View>
);

export const HomePage = () => {
  const { remove } = useNotes();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteNotes();
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const isSelectionMode = selectedNoteIds.length > 0;

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleLongPress = (noteId: string) => {
    if (!isSelectionMode) setSelectedNoteIds([noteId]);
  };

  const handleCancel = () => setSelectedNoteIds([]);

  const handleDelete = async () => {
    if (selectedNoteIds.length === 0) return;

    try {
      await Promise.all(selectedNoteIds.map((id) => remove.mutateAsync(id)));

      Toast.show({
        type: "success",
        text1: `${selectedNoteIds.length} Note(s) Deleted`,
        position: "bottom",
        visibilityTime: 4000,
      });

      setSelectedNoteIds([]);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Failed to delete some notes",
        position: "bottom",
        visibilityTime: 4000,
      });
      console.error(err);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const allNotes = data?.pages.flatMap((page) => page.data) ?? [];

  const filteredNotes = searchQuery
    ? allNotes.filter((note) =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allNotes;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Notes"
        isSelectionMode={isSelectionMode}
        selectedCount={selectedNoteIds.length}
        onPressCancel={handleCancel}
        onPressDelete={handleDelete}
      />

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.contentRoot}>
        {isLoading ? (
          <View style={{ paddingTop: 10 }}>
            {Array.from({ length: 7 }).map((_, index) => (
              <SkeletonNote key={index} />
            ))}
          </View>
        ) : filteredNotes.length === 0 ? (
          <NoNotes />
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id!}
            renderItem={({ item }) => (
              <TouchableOpacity
                onLongPress={() => handleLongPress(item.id!)}
                onPress={() =>
                  isSelectionMode
                    ? handleSelectNote(item.id!)
                    : console.log("Navigate")
                }
                style={[styles.noteCard, { backgroundColor: item.bgColor }]}
              >
                <Text style={styles.content}>{item.content}</Text>
              </TouchableOpacity>
            )}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              isFetchingNextPage ? <ActivityIndicator /> : null
            }
          />
        )}
      </View>
      <Toast />
    </SafeAreaView>
  );
};
