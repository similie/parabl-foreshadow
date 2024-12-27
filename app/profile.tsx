import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { storeUserDetails, logoutUser, updateUser } from "@libs"; // Replace with your actual functions
import { User } from "@/types/context";
import { userGlobalStore } from "@/libs";
import { UsernameCheck, VerifyModal } from "@/components";

import {
  ArrowLeftEndOnRectangleIcon,
  PencilSquareIcon,
  HomeIcon,
  NoSymbolIcon,
} from "react-native-heroicons/solid"; // Icon library
const ProfilePage: React.FC = () => {
  const user = userGlobalStore((state) => state.user);
  const [dirty, setDirty] = useState<Record<string, boolean>>({
    name: false,
    userName: false,
    email: false,
    phone: false,
  });

  const [thisUser, setUser] = useState<User>(user as User);
  const [isSaving, setIsSaving] = useState(false);
  const [editDetails, setEditDetails] = useState(false);

  const childRef = useRef<any>(null); // Ref to interact with the child
  const onReady = () => {
    setEditDetails(true);
  };
  const routeHome = () => {
    router.push("/"); // Redirect to login page
  };
  const profileEdit = async () => {
    if (!childRef.current) {
      return;
    }
    childRef.current.open();
  };

  const handleInputChange = (field: string, value: string) => {
    const key: keyof User = field as keyof User;
    const checkValid = user![key];
    const changed = checkValid !== value;
    setDirty((previous) => ({ ...previous, [field]: changed }));
    setUser((prev) => ({ ...prev, [key]: value }));
  };
  const setUserName = (valid: boolean, username: string) => {
    setDirty((previous) => ({ ...previous, userName: valid }));
    if (!valid) {
      return;
    }
    setUser((prev) => ({ ...prev, userName: username }));
  };

  const runPristine = () => {
    setDirty((previous) => {
      const keys = Object.keys(previous);
      for (const key of keys) {
        previous[key] = false;
      }
      return previous;
    });
  };

  const handleSave = async () => {
    if (!user) {
      return;
    }

    try {
      setIsSaving(true);
      runPristine();

      const updatedUser = await updateUser(user.id, {
        name: thisUser.name,
        // email: thisUser.email,
        userName: thisUser.userName,
        // phone: thisUser.phone,
      });
      await logoutUser();
      setUser(updatedUser);
      await storeUserDetails(updatedUser);
      setEditDetails(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile Update Error", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    routeHome(); // Redirect to login page
  };

  return (
    <View style={styles.container} className="mt-16">
      {!editDetails && (
        <>
          <View className="w-full  flex flex-row justify-between items-center">
            <Text style={styles.title}>Profile</Text>

            <TouchableOpacity className="-mt-7" onPress={profileEdit}>
              <PencilSquareIcon color="black" />
            </TouchableOpacity>
          </View>
          {/* User Details */}
          <Text style={styles.name}>{user!.name}</Text>
          <Text style={styles.username}>@{user!.userName}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user!.email}</Text>
          </View>
          {/* <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{user!.phone || ""}</Text>
          </View> */}
        </>
      )}

      {editDetails && (
        <>
          <View className="w-full  flex flex-row justify-between items-center">
            <Text style={styles.title}>Update Profile</Text>

            <TouchableOpacity
              className="-mt-7"
              onPress={() => setEditDetails(false)}
            >
              <NoSymbolIcon color="black" />
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.title}>Update Profile</Text> */}

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={thisUser.name}
            onChangeText={(text) => handleInputChange("name", text)}
          />

          {/* Username Input */}
          <UsernameCheck
            className="w-full "
            userName={thisUser.userName}
            setValidity={(valid, username) => setUserName(valid, username)}
          />

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.button, isSaving && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving || !(dirty.name || dirty.userName)}
          >
            <Text style={styles.buttonText}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        className="absolute bottom-8 left-8 flex-col  "
        onPress={routeHome}
      >
        <HomeIcon className="place-self-center" color="black" />
        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="absolute bottom-8 right-8   flex-col text-center"
        onPress={handleLogout}
      >
        <ArrowLeftEndOnRectangleIcon color="black" />
        <Text>Logout</Text>
      </TouchableOpacity>

      <VerifyModal ref={childRef} onReady={onReady} />
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  navButtons: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  username: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#333",
    marginRight: 5,
  },
  infoValue: {
    color: "#666",
  },
});
