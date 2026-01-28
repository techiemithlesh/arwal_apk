import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { handleFocus, handleBlur } from "./focusHandlers";

export default function App() {
  const [state, setState] = useState({ focused: false, error: "" });
  const [value, setValue] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          state.focused && styles.inputFocused,
          state.error && styles.inputError,
        ]}
        placeholder="Enter something"
        value={value}
        onChangeText={setValue}
        onFocus={() => handleFocus(setState)}
        onBlur={() => handleBlur(value, setState)}
      />

      {state.error ? (
        <Text style={styles.error}>{state.error}</Text>
      ) : (
        <Text>{state.focused ? "Focused" : "Blurred"}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, borderColor: "gray", borderRadius: 5, padding: 10 },
  inputFocused: { borderColor: "blue" },
  inputError: { borderColor: "red" },
  error: { color: "red", marginTop: 5 },
});
