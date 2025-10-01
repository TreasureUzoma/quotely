import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { buttonStyles as styles } from "../../styles/button";

export const CustomButton = ({
  title,
  onPress,
  style,
  textStyle,
  disabled,
  iconLeft,
  iconRight,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabledButton, style]}
    >
      <View style={styles.content}>
        {iconLeft && <View style={styles.icon}>{iconLeft}</View>}
        <Text style={[styles.text, textStyle]}>{title}</Text>
        {iconRight && <View style={styles.icon}>{iconRight}</View>}
      </View>
    </TouchableOpacity>
  );
};
