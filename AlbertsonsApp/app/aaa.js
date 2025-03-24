import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import Header from "../components/Header";

export default function Scan() {
    return (
        <View style={styles.container}>
            <Header title="Scan" />
            <Text variant="titleLarge">This is the Scan screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" }
});
// const db = mysql.createConnection({
//     host: "mysql-dinesh-23.alwaysdata.net",
//     user: "dinesh-23_albert",
//     password: "albertson@23",
//     database: "dinesh-23_albertsonapp",
// });