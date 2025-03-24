import { View, Image, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>Welcome</Text>
      <Button mode="contained" onPress={() => router.push("./login")} style={styles.button}>Get Started</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { marginBottom: 20 },
  button: { width: "80%" }
});
