import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { Rect, Defs, Mask } from "react-native-svg";

const { width, height } = Dimensions.get("window");

const innerDimension = 250; // Adjusted for better scaling
const borderRadius = 20; // Smoother rounded corners

export const Overlay = () => {
    const cutoutX = (width - innerDimension) / 2;
    const cutoutY = (height - innerDimension) / 2;

    return (
        <View style={styles.overlay}>
            <Svg height={height} width={width}>
                <Defs>
                    {/* Create a mask with a transparent QR scanner cutout */}
                    <Mask id="mask">
                        {/* Fully opaque background */}
                        <Rect width={width} height={height} fill="white" />
                        {/* Transparent cutout for QR scanner */}
                        <Rect
                            x={cutoutX}
                            y={cutoutY}
                            width={innerDimension}
                            height={innerDimension}
                            rx={borderRadius}
                            ry={borderRadius}
                            fill="black"
                        />
                    </Mask>
                </Defs>

                {/* Apply the mask to darken everything except the scanner area */}
                <Rect
                    width={width}
                    height={height}
                    fill="rgba(0, 0, 0, 0.7)"
                    mask="url(#mask)"
                />

                {/* Optional: White border around the scanning area */}
                <Rect
                    x={cutoutX}
                    y={cutoutY}
                    width={innerDimension}
                    height={innerDimension}
                    rx={borderRadius}
                    ry={borderRadius}
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
});
