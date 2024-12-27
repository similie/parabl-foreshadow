import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { HomeIcon } from "react-native-heroicons/solid"; // Icon library
const routeHome: React.FC<{ className?: string }> = ({ className }) => {
  const routeHome = () => {
    router.push("/");
  };
  return (
    <TouchableOpacity className={className} onPress={routeHome}>
      <HomeIcon />
    </TouchableOpacity>
  );
};
export default routeHome;
