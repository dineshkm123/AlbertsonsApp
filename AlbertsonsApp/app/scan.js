import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useCameraPermissions } from "expo-camera";

export default function Scan() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={isPermissionGranted ? () => router.push("/scanner") : requestPermission}
        >
          <Text style={styles.buttonText}>
            {isPermissionGranted ? "✅ Permission Granted - Tap to Scan" : "📸 Request Camera Access"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAF3E9", // Dark mode background
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#0E7AFE",
    textAlign: "center",
    marginBottom: 40,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0E7AFE",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    shadowColor: "#0E7AFE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // For Android shadow effect
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

