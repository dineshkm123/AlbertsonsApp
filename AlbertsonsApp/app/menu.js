import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button } from "react-native-paper";
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
            <View style={styles.buttonContainer}>
                {buttons.map((btn) => (
                    <Button
                        key={btn.id}
                        mode="contained"
                        icon={btn.icon}
                        onPress={() => router.push(btn.route)}
                        style={styles.button}
                        labelStyle={styles.buttonText}
                        contentStyle={styles.buttonContent}
                    >
                        {btn.title}
                    </Button>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FAF3E9", // Dark mode background
        padding: 20,
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
    },
    button: {
        marginVertical: 10,
        width: "80%",
        borderRadius: 10,
        elevation: 3, // Adds shadow for Android
        backgroundColor: "#0E7AFE",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
        textTransform: "uppercase",
    },
    buttonContent: {
        height: 50, // Makes the button taller
    },
});

