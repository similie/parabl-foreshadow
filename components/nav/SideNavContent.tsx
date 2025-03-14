import { router } from "expo-router";
import { getUserDetails, SIMILIE_BLUE } from "@libs";
import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { userGlobalStore } from "@/libs/context";
import { LocationsList } from ".";
const sideNavContent: React.FC = () => {
  const user = userGlobalStore((state) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      await getUserDetails();
    };
    fetchUser();
  }, []);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View className="w-full" style={styles.locations}>
          <Text>Welcome back, {user.name}</Text>

          <LocationsList user={user} />
        </View>
      ) : (
        <View>
          <TouchableOpacity
            className="mt-5 bg-black px-8 py-3 rounded-lg"
            onPress={handleRegister}
          >
            <Text className="text-white text-lg font-bold">Register</Text>
          </TouchableOpacity>
          <Text className="mt-4" style={styles.text}>
            or{" "}
            <Text
              style={styles.linkText}
              selectionColor={SIMILIE_BLUE}
              onPress={handleLogin}
            >
              login
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  linkText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  locations: {
    alignSelf: "flex-start",
    flexGrow: 1,
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default sideNavContent;
