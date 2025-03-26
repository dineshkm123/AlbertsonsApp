import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";

export default function TabsLayout() {
  return (
    <PaperProvider>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons = {
              home: "home",
              profile: "person",
            };
            return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0E7AFE",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#121212", paddingBottom: 5 },
          headerShown: false, // Hide headers
        })}
      >
        <Tabs.Screen name="home" options={{ title: "Home" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      </Tabs>
    </PaperProvider>
  );
}
