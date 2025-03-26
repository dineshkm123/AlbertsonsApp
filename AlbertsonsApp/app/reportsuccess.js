import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SuccessScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Icon name="check-circle" size={100} color="#4CAF50" style={styles.icon} />
            <Text style={styles.message}>Report Submitted Successfully!</Text>

            <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.buttonText}>Go to Home</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E8F5E9",
    },
    icon: {
        marginBottom: 20,
    },
    message: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2E7D32",
        marginBottom: 30,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#388E3C",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonPressed: {
        backgroundColor: "#2E7D32",
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
