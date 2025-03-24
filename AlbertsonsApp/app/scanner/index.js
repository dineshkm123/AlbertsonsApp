import { CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
    AppState,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
} from "react-native";
import * as Location from "expo-location";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";

export default function Home() {

    const router = useRouter();
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const [scannedData, setScannedData] = useState(null);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isFetchLocationEnabled, setIsFetchLocationEnabled] = useState(false); // Initially disabled

    useEffect(() => {
        const timer = setTimeout(() => setShowCamera(true), 300);
        return () => clearTimeout(timer);
    }, []);

    const fetchLocationAndSubmit = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setError("Permission to access location was denied");
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        if (loc && loc.coords) {
            setLocation(loc.coords);

            // Prepare data to send to backend
            const requestData = {
                ...scannedData, // ✅ Includes dynamic scanned data
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            };

            console.log("Scanned data in front end:", scannedData); // ✅ Debugging log

            try {
                const response = await fetch("http://192.168.1.43:3000/api/insert-device-info", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(scannedData),
                });

                const result = await response.json();
                console.log("Server Response:", result); // ✅ Debugging log
                if (response.ok) {
                    Alert.alert("Success", "Data inserted successfully!", [
                        { text: "OK", onPress: () => router.push("/report") },
                    ]);
                } else {
                    setError(result.message || "Failed to insert data into database.");
                }
            } catch (err) {
                setError("Error connecting to server.");
            }



        } else {
            setError("Failed to fetch location.");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    title: "Overview",
                    headerShown: false,
                }}
            />
            {Platform.OS === "android" ? <StatusBar hidden translucent backgroundColor="transparent" /> : null}

            {showCamera && (
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    resizeMode="cover"
                    onBarcodeScanned={async ({ data }) => {
                        if (data && !qrLock.current) {
                            try {
                                console.log("Raw QR Data:", data); // ✅ Debugging log
                                const jsonData = JSON.parse(data);
                                if (typeof jsonData !== "object" || jsonData === null) {
                                    throw new Error("Invalid JSON format");
                                }
                                setScannedData(jsonData);
                                setError(null);
                                setIsFetchLocationEnabled(true);
                            } catch (e) {
                                console.error("QR Code Error:", e.message); // ✅ Log actual error
                                setScannedData(null);
                                setError("Invalid QR format: " + e.message);
                            }
                            qrLock.current = true;
                            setTimeout(() => {
                                qrLock.current = false;
                            }, 2000);
                        }
                    }}

                />
            )}

            <Overlay />

            {scannedData && (
                <View style={styles.dataContainer}>
                    <Text style={styles.dataText}>
                        Scanned Data: {JSON.stringify(scannedData, null, 2)}
                    </Text>
                    {location && (
                        <>
                            <Text style={styles.dataText}>Latitude: {location.latitude}</Text>
                            <Text style={styles.dataText}>Longitude: {location.longitude}</Text>
                        </>
                    )}
                </View>
            )}

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.buttonContainer}>
                <Button
                    title="Submit"
                    onPress={fetchLocationAndSubmit}
                    disabled={!isFetchLocationEnabled}
                    color={isFetchLocationEnabled ? "blue" : "gray"}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    dataContainer: {
        position: "absolute",
        bottom: 290,
        left: 20,
        right: 20,
        backgroundColor: "white",
        padding: 50,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    dataText: {
        fontSize: 16,
        color: "black",
    },
    errorContainer: {
        position: "absolute",
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    errorText: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
    },
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
});
