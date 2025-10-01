import React, { useRef, useState } from "react";
import { View, Text, FlatList, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomButton } from "../components/ui/button";
import { onboardingStyles as styles, width } from "../styles/onbarding";

const slides = [
  {
    id: "1",
    title: "Manage your notes easily",
    text: "A completely easy way to manage and customize your notes.",
    image: require("../assets/images/onboarding/clip-1060.png"),
  },
  {
    id: "2",
    title: "Organize your thougts",
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
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />

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

      <CustomButton
        title={currentIndex === slides.length - 1 ? "Get Started" : "Next"}
        onPress={handleNext}
        style={{ width: "90%" }}
      />
    </View>
  );
};
