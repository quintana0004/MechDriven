import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors/Colors";

function CheckBox({ onValueCheck, valueCheck }) {
  const [check, setCheck] = useState(valueCheck);

  return (
    <Pressable
      onPress={() => {
        setCheck(!check);
        onValueCheck(!check);
      }}
    >
      <View
        style={[
          styles.checkContainer,
          { backgroundColor: check ? Colors.darkGreen : Colors.white },
        ]}
      >
        <FontAwesome name="check" size={16} color={Colors.white} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  checkContainer: {
    width: 30,
    height: 30,
    borderColor: Colors.darkGreen,
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
  },
});

export default CheckBox;
