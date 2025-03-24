import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, List } from "react-native-paper";
import buttonsData from "../config/buttons.json";
import Header from "../components/Header";

export default function ButtonsScreen() {
    const router = useRouter();
    const [buttons, setButtons] = useState([]);

    useEffect(() => {
        setButtons(buttonsData);
    }, []);

    return (
        <View style={styles.container}>
            <Header title="Actions" />
            {buttons.map((btn) => (
                <Button
                    key={btn.id}
                    mode="contained"
                    icon={btn.icon}
                    onPress={() => router.push(btn.route)}
                    style={styles.button}
                >
                    {btn.title}
                </Button>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    button: { marginVertical: 10, width: "80%" }
});
