import { router } from "expo-router";
import { getUserDetails } from "@libs";
import { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { userGlobalStore } from "@/libs/context";
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
        <Text>Welcome back, {user.name}</Text>
      ) : (
        <View>
          <TouchableOpacity
            className="mt-5 bg-blue-500 px-8 py-3 rounded-lg"
            onPress={handleRegister}
          >
            <Text className="t1ext-white text-lg font-bold">Register</Text>
          </TouchableOpacity>
          <Text className="mt-4" style={styles.text}>
            or{" "}
            <Text
              className="color-blue-400"
              style={styles.linkText}
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
    // color: "#007AFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

export default sideNavContent;
