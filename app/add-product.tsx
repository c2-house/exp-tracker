import { Feather, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';

export default function AddProductScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isFlashOn, setIsFlashOn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (permission === null || !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-center text-lg mb-4">카메라 사용 권한이 필요합니다.</Text>
        <Button onPress={requestPermission} title="권한 요청" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView className="flex-1" />

      {/* Header */}
      <View className="absolute top-0 left-0 right-0 p-5 bg-black/50 z-10">
        <View className="flex-row justify-between items-center">
          <View className="w-6" />
          <Text className="text-white text-lg font-semibold">새 상품 등록</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-base text-center mt-5">
          상품명과 유통기한을 순서대로 촬영해주세요.
        </Text>
      </View>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-between items-center px-10 py-5 bg-black/50 z-10">
        <TouchableOpacity className="w-12 h-12 justify-center items-center bg-white/30 rounded-full">
          <Ionicons name="images-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity className="w-[72px] h-[72px] justify-center items-center rounded-full bg-white border-[5px] border-primary-1">
          <Feather name="camera" size={28} color="var(--primary-1)" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-12 h-12 justify-center items-center bg-white/30 rounded-full"
          onPress={() => setIsFlashOn(!isFlashOn)}
        >
          <Ionicons name={isFlashOn ? 'flash' : 'flash-off'} size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
