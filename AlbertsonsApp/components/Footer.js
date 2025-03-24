import { BottomNavigation } from "react-native-paper";
import { useRouter } from "expo-router";

export default function Footer() {
  const router = useRouter();

  const routes = [
    { key: "home", title: "Home", icon: "home", route: "/home" },
    { key: "scan", title: "Scan", icon: "camera", route: "/scan" },
    { key: "tv", title: "TV", icon: "television", route: "/tv" }
  ];

  return (
    <BottomNavigation
      navigationState={{ index: 0, routes }}
      onIndexChange={(index) => router.push(routes[index].route)}
    />
  );
}
