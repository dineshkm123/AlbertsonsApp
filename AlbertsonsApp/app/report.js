import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    Pressable,
    Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export default function DeviceInfo() {
    const [deviceData, setDeviceData] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);

    useEffect(() => {
        fetchDeviceData();
        requestLocationPermission();
    }, []);

    // Fetch device details
    const fetchDeviceData = async () => {
        try {
            const response = await fetch("http://192.168.17.140:3000/api/get-device-info");
            const data = await response.json();
            setDeviceData(data);
        } catch (error) {
            console.error("Error fetching device data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Request location permission
    const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permission Denied", "Location permission is required.");
            return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    };

    // Pick image from gallery
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: [ImagePicker.MediaType.IMAGE],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // Take a new photo
    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!image || !location) {
            Alert.alert("Error", "Please upload an image and allow location access.");
            return;
        }

        const formData = new FormData();
        formData.append("image", {
            uri: image,
            type: "image/jpeg",
            name: "report.jpg"
        });
        formData.append("latitude", location.latitude);
        formData.append("longitude", location.longitude);

        try {
            const response = await fetch("http://192.168.17.140:3000/api/submit-report", {
                method: "POST",
                body: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            const result = await response.json();
            console.log("result", result);

            if (response.ok) {
                Alert.alert("Success", "Reported successfully!");
            } else {
                Alert.alert("Failed", result.message || "Try again.");
            }
        } catch (error) {
            Alert.alert("Error", "Network error, try again later.");
        }
    };

    // Custom Button Component
    const CustomButton = ({ title, onPress }) => (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}
            android_ripple={{ color: "#66bb6a" }}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            {/* Device Information Section */}
            <View>
                <Text style={styles.header}>Device Information</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : deviceData ? (
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>Serial Number: {deviceData.serialNumber}</Text>
                        <Text style={styles.infoText}>Firmware Version: {deviceData.firmwareVersion}</Text>
                        <Text style={styles.infoText}>MAC Address: {deviceData.macAddress}</Text>
                        <Text style={styles.infoText}>Hardware Key: {deviceData.hardwareKey}</Text>
                        <Text style={styles.infoText}>Display Name: {deviceData.displayName}</Text>
                        <Text style={styles.infoText}>Project: {deviceData.project}</Text>
                    </View>
                ) : (
                    <Text style={styles.errorText}>Failed to load device data.</Text>
                )}
            </View>

            {/* Upload Photo Section */}
            <View style={styles.uploadContainer}>
                <View style={styles.uploadbtn}>
                    <CustomButton title="Take Photo" onPress={takePhoto} />
                </View>
                <View style={styles.uploadbtn}>
                    <CustomButton title="Upload Photo" onPress={pickImage} />
                </View>

                {image && <Image source={{ uri: image }} style={styles.image} />}

                <View style={styles.submitButton}>
                    <CustomButton title="Submit" onPress={handleSubmit} />
                </View>
            </View>
        </View>
    );
}

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#e0f7fa",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1565c0",
        textAlign: "center",
    },
    infoContainer: {
        width: "100%",
        padding: 15,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowColor: "#004d40",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        color: "#263238",
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: "#ff3d00",
        marginBottom: 20,
        textAlign: "center",
    },
    uploadContainer: {
        width: "100%",
        padding: 15,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowColor: "#004d40",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    uploadbtn: {
        marginBottom: 15,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "#00796b",
    },
    submitButton: {
        marginTop: 20,
        alignItems: "center",
    },
    button: {
        backgroundColor: "#1976D2",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonPressed: {
        backgroundColor: "#1565C0",
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
