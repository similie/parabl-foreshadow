import { userRegistrationStore } from "@/libs/context";
import { regStyles } from "./RegStyles";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import UsernameCheck from "./UsernameCheck";
const Step2: React.FC<{ onNext: () => void; onPrevious: () => void }> = ({
  onNext,
  onPrevious,
}) => {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [validityFields, setValidityFields] = useState<{
    username: boolean;
    name: boolean;
  }>({ username: false, name: false });

  const setNameDetails = (text: string) => {
    setFullname(text);
    setValidityFields((pre) => {
      pre.name = text !== "";
      return pre;
    });
  };

  const handleNext = () => {
    if (!username || !fullname) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    userRegistrationStore.getState().setUserName(username);
    userRegistrationStore.getState().setName(fullname);
    onNext();
  };

  useEffect(() => {
    const state = userRegistrationStore.getState();
    const un = state.userName;
    if (un) {
      setUsername(un);
    }
    const name = state.name;
    if (name) {
      setFullname(name);
    }
  }, []);

  const onValidate = (valid: boolean, username: string) => {
    setUsername(username);
    setValidityFields((pre) => {
      pre.username = valid;
      return pre;
    });
  };

  const onError = (_e: any) => {
    onPrevious();
  };

  return (
    <View style={regStyles.container}>
      <Text style={regStyles.title}>Step 2: Setup Profile</Text>
      <TextInput
        style={regStyles.input}
        placeholder="Full Name"
        value={fullname}
        onChangeText={setNameDetails}
        autoCapitalize="words"
        autoCorrect={false}
      />

      <UsernameCheck
        setValidity={onValidate}
        userName={username}
        onError={onError}
      />
      <View>
        {validityFields.name && validityFields.username && (
          <TouchableOpacity
            disabled={!username || !fullname}
            style={regStyles.button}
            onPress={handleNext}
          >
            <Text style={regStyles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Step2;
