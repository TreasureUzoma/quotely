import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomButton } from "../components/ui/button";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    title: "Manage your notes easily",
    text: "A completely easy way to manage and customize your notes.",
    image: require("../assets/images/onboarding/clip-1060.png"),
  },
  {
    id: "2",
    title: "Organize your thougt",
    text: "Most beautiful note taking application.",
    image: require("../assets/images/onboarding/clip-chatting-with-girlfriend 1.png"),
  },
  {
    id: "3",
    title: "Create cards and easy styling",
    text: "Making your content legible has never been easier.",
    image: require("../assets/images/onboarding/clip-1026.png"),
  },
];

export const OnboardingPage = ({ navigation }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleDone();
    }
  };

  const handleDone = async () => {
    await AsyncStorage.setItem("hasSeenOnboarding", "true");
    navigation.replace("Auth");
  };

  return (
    <View style={styles.root}>
      {/* Slider */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Image Top */}
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />

            {/* Text Center */}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Button Bottom */}
      <CustomButton
        title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        onPress={handleNext}
        style={{ width: "90%" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  slide: {
    width,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.7,
    height: height * 0.35,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: "Geist_700Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Geist_400Regular",
    color: "#555",
  },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#007AFF",
    width: 20,
  },
});
