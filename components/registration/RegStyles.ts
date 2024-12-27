import { StyleSheet } from "react-native";
export const regStyles = StyleSheet.create({
  container: { alignItems: "center" },

  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "80%",
    textAlign: "center",
    padding: 10,

    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    borderColor: "#ccc",
  },
  inputBorderless: {
    width: "80%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: { flexDirection: "row", marginBottom: 20 },
  otpInput: {
    width: 40,
    height: 40,
    marginHorizontal: 5,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
  },
  button: {
    width: "80%",
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold" },
  navButtons: {},
  navButton: { padding: 10, marginHorizontal: 10 },

  resetButton: {
    width: "80%",
    padding: 15,
    backgroundColor: "#FF4D4D",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  resetButtonText: { color: "white", fontWeight: "bold" },
});
