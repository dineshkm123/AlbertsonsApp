import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    ActivityIndicator,
    Pressable
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function DeviceInfo() {
    const [deviceData, setDeviceData] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeviceData();
    }, []);

    const fetchDeviceData = async () => {
        try {
            const response = await fetch("http://192.168.1.43:3000/api/get-device-info"); // Replace with your API URL
            const data = await response.json();
            console.log("db inda barthiro data", data);
            setDeviceData(data);
        } catch (error) {
            console.error("Error fetching device data:", error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = () => {
        alert("Reported successfully!");
    };

    const CustomButton = ({ title, onPress }) => {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.button,
                    pressed ? styles.buttonPressed : null,
                ]}
                android_ripple={{ color: '#66bb6a' }}
            >
                <Text style={styles.buttonText}>{title}</Text>
            </Pressable>
        );
    };

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
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e0f7fa', // Light cyan background
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1565c0', // Deep blue for the header
        textAlign: 'center',
    },
    infoContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: '#ffffff', // White background for the info container
        borderRadius: 10,
        shadowColor: '#004d40', // Dark teal shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        color: '#263238', // Dark gray for text
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: '#ff3d00', // Bright red for error messages
        marginBottom: 20,
        textAlign: 'center',
    },
    uploadContainer: {
        width: '100%',
        padding: 15,
        backgroundColor: '#ffffff', // White background for the upload section
        borderRadius: 10,
        shadowColor: '#004d40', // Dark teal shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    uploadbtn: {
        marginBottom: 15, // Space between upload buttons
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#00796b', // Teal border for the image
    },
    submitButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#1976D2', // Primary blue button
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonPressed: {
        backgroundColor: '#1565C0', // Darker blue when pressed
    },
    buttonText: {
        color: '#ffffff', // White text on button
        fontWeight: 'bold',
        fontSize: 16,
    },
});
