import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Header from "../../components/Header"; // ✅ Keep Header

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Home" />
      <Text variant="titleLarge">Welcome Home!</Text>
      <Button mode="contained" onPress={() => router.push("/login")} style={styles.button}>
        Go to Buttons
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: { marginTop: 20, width: "80%" },
});
