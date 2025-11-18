import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="scan-product" />
        <Stack.Screen name="add-product" />
        <Stack.Screen name="notifications" />
      </Stack>
    </SafeAreaProvider>
  );
}
