import { Alert, Button, StyleSheet, Text, View } from "react-native";

import * as ExpoCapture from "expo-capture";
import { useEffect, useState } from "react";

export default function App() {
    const [prevented, setPrevented] = useState(false);

    useEffect(() => {
        const subscription = ExpoCapture.addScreenshotListener(() => {
            Alert.alert("Screenshot taken!");
        });
        return () => {
            subscription.remove();
        };
    }, []);

    async function handlePress() {
        if (prevented) {
            await ExpoCapture.allowScreenCapture();
            setPrevented(false);
        } else {
            await ExpoCapture.preventScreenCapture();
            setPrevented(true);
        }
    }

    return (
        <View style={styles.container}>
            {/* TODO: Remove `hello` when package is finished */}
            <Text>{ExpoCapture.hello()}</Text>
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
    },
});
