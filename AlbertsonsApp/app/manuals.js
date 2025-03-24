import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Header from "../components/Header";

export default function Manuals() {
    return (
        <View style={styles.container}>
            <Header title="Manual" />
            <Text variant="titleLarge">This is the  Manual  screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" }
});
