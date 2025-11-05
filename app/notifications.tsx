import { Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Stack.Screen options={{ title: '알림 목록' }} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-center text-black-3">
          푸시 알림이 도착하면{'\n'}여기에서 확인할 수 있어요.
        </Text>
      </View>
    </SafeAreaView>
  );
}
