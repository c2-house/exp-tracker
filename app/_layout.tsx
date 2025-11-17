import { Stack } from 'expo-router';
import './global.css';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scan-product" />
      <Stack.Screen name="confirm-product" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
