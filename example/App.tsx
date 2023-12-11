import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import * as ExpoCapture from "expo-capture";
import { useEffect, useState } from "react";

export default function App() {
    const [prevented, setPrevented] = useState(false);

    useEffect(() => {
        if (Platform.OS === "android") return;
        const subscription = ExpoCapture.addScreenshotListener(() => {
            Alert.alert("Screenshot taken!");
        });
        return () => {
            subscription.remove();
        };
    }, []);

    async function handlePress() {
        if (prevented) {
            await ExpoCapture.allowScreenCaptureAsync();
            setPrevented(false);
        } else {
            await ExpoCapture.preventScreenCaptureAsync();
            setPrevented(true);
        }
    }

    return (
        <View style={styles.container}>
            <Text>{"Hello world :)"}</Text>
            <Button title={prevented ? "Allow" : "Prevent"} onPress={handlePress} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        rowGap: 10,
    },
});
