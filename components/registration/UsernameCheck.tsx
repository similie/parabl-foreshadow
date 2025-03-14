import { debounceCallback, registeredUser } from "@libs";
import React, { useRef, useState } from "react";
import { Text, TextInput, Alert } from "react-native";
import { regStyles } from "./RegStyles";

const UsernameCheck: React.FC<{
  setValidity: (valid: boolean, username: string) => void;
  onError?: (e: any) => void;
  className?: string | undefined;
  userName: string;
}> = ({ setValidity, onError, className, userName = "" }) => {
  const [username, setUsername] = useState(userName);
  const [validUsername, setValidUsername] = useState(false);
  const [validUsernameText, setValidUsernameText] = useState("");
  const debouncedCheckValidity = useRef(
    debounceCallback(async (text: string) => {
      try {
        setValidUsername(false);
        setValidUsernameText("");
        setValidity(false, "");
        if (!text) {
          return;
        } else if (text === userName) {
          return setValidity(true, text);
        } else if (text.length < 6) {
          return setValidUsernameText(
            "Username should be at least six characters",
          );
        } // Ensure username has no spaces
        if (/\s/.test(text)) {
          return setValidUsernameText("Username cannot contain spaces");
        }

        const searched = await registeredUser({ userName: text });
        const valid = searched.registered === false;
        setValidUsername(valid);

        valid
          ? setValidUsernameText("Username is Available")
          : setValidUsernameText("Username is Taken");

        setValidity(valid, text);
      } catch (e: any) {
        Alert.alert("Error", e.message);
        if (onError) {
          onError(e);
        }
      }
    }, 1000),
  ).current;
  const handleChange = (text: string) => {
    setUsername(text);
    debouncedCheckValidity(text); // Use the debounced function
  };

  return (
    <>
      <TextInput
        style={regStyles.input}
        placeholder="Username"
        value={username}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={handleChange}
        className={className}
        returnKeyType="done"
      />
      {validUsernameText && (
        <Text className={validUsername ? "color-green-600 " : "color-red-600"}>
          {validUsernameText}
        </Text>
      )}
    </>
  );
};

export default UsernameCheck;
