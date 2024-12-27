import { Image, StyleSheet } from "react-native";

const LogoIcon: React.FC<{ size?: number }> = ({ size }) => {
  const getStyle = () => {
    const sendStyles = {
      ...styles.avatar,
    };

    if (size) {
      sendStyles.width = size;
      sendStyles.height = size;
    }
    return sendStyles;
  };

  return (
    <Image
      source={require("../../assets/images/Parabl.png")} // Replace with the path to your logo
      style={getStyle()}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40, // Adjust size as needed
    height: 40, // Adjust size as needed
    // borderRadius: 20, // Makes the avatar circular if the image is square
  },
});

export default LogoIcon;
