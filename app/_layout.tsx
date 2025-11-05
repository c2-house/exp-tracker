import { Stack } from 'expo-router';
import './global.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add-product" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ title: '알림 목록' }} />
    </Stack>
  );
}
