import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Header from "../components/Header";

export default function LoginScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Header title="Login" />
            <Text variant="titleLarge">Login Page</Text>
            <Button mode="contained" onPress={() => router.push("/menu")} style={styles.button}>
                Login
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    button: { marginTop: 20, width: "80%" }
});
