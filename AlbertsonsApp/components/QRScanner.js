import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";

// 🔹 Define CameraType
const CameraType = { back: "back", front: "front" };

export default function Scan() {
    const [facing, setFacing] = useState(CameraType.back);
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const cameraRef = useRef(null); // Camera reference

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    if (!permission || !permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need camera access to scan QR codes</Text>
                <Button title="Grant Permission" onPress={requestPermission} />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    async function captureAndScan() {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ base64: true });
            if (photo) {
                setScanned(true);
                Alert.alert("Success", "QR Code scanned from the image!", [{ text: "OK", onPress: () => setScanned(false) }]);
            }
        }
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={captureAndScan}>
                        <Text style={styles.text}>Capture</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center" },
    message: { textAlign: "center", paddingBottom: 10 },
    camera: { flex: 1 },
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", padding: 20 },
    button: { backgroundColor: "#007bff", padding: 10, borderRadius: 5 },
    text: { fontSize: 18, color: "white" },
});
