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

      <View className="fixed inset-0 pt-5 pb-12 px-5 justify-between z-10 bg-black/50">
        {/* Header */}
        <View>
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">새 상품 등록</Text>
            <View className="w-6" />
          </View>
          <Text className="text-white text-base text-center mt-5">
            상품명과 유통기한을 순서대로 촬영해주세요.
          </Text>
        </View>
        {/* Guideline */}
        <View className="items-center justify-center px-5">
          <View className="w-full h-[50vh] max-w-[500px] max-h-[350px] border-2 border-white rounded-2xl" />
        </View>
        {/* Footer */}
        <View className="flex-row justify-around items-center">
          <TouchableOpacity className="w-12 h-12 justify-center items-center bg-white/30 rounded-full">
            <Ionicons name="images-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity className="w-[72px] h-[72px] justify-center items-center rounded-full bg-white border-4 border-primary-1">
            <Feather name="camera" size={28} color="var(--primary-1)" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-12 h-12 justify-center items-center bg-white/30 rounded-full"
            onPress={() => setIsFlashOn(!isFlashOn)}
          >
            {isFlashOn ? (
              <Ionicons name="flash" size={24} color="white" />
            ) : (
              <Ionicons name="flash-off" size={24} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
