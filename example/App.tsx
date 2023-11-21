import { StyleSheet, Text, View } from 'react-native';

import * as ExpoCapture from 'expo-capture';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ExpoCapture.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
