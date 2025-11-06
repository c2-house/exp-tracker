import { Feather, Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, type FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddProductScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState<FlashMode>('auto');
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (permission === null || !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission]);

  const handleTakePicture = async () => {
    if (!permission?.granted) {
      Alert.alert(
        '카메라 접근 권한 요청',
        '이 기능을 사용하려면 설정에서 카메라 접근을 허용해주세요.',
        [
          { text: '취소', style: 'destructive' },
          { text: '설정 열기', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        shutterSound: false,
      });
      console.log('Photo taken:', photo);
      // TODO: Navigate to confirm screen with photo uri
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '사진 접근 권한 요청',
        '이 기능을 사용하려면 설정에서 사진(저장공간) 접근을 허용해주세요.',
        [
          { text: '취소', style: 'destructive' },
          { text: '설정 열기', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image picked:', result.assets[0].uri);
      // TODO: Navigate to confirm screen with image uri
    }
  };

  const handleFlashModeChange = () => {
    const flashModes: FlashMode[] = ['auto', 'on', 'off'];
    const currentIndex = flashModes.indexOf(flashMode);
    const nextIndex = (currentIndex + 1) % flashModes.length;
    setFlashMode(flashModes[nextIndex]);
  };

  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} flash={flashMode} className="flex-1" />

      {/* Header */}
      <View
        className="absolute top-0 left-0 right-0 p-5 bg-black/50 z-10"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row justify-between items-center">
          <View className="w-6" />
          <Text className="text-white text-lg font-semibold">새 상품 등록</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-white text-base text-center mt-6">
          상품명과 유통기한을 순서대로 촬영해주세요.
        </Text>
      </View>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row justify-between items-center px-10 pt-5 bg-black/50 z-10"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <TouchableOpacity
          className="w-12 h-12 justify-center items-center bg-white/30 rounded-full"
          onPress={handlePickImage}
        >
          <Ionicons name="images-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-[72px] h-[72px] justify-center items-center rounded-full bg-white border-[5px] border-primary-1"
          onPress={handleTakePicture}
        >
          <Feather name="camera" size={28} color="#0061FF" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-12 h-12 justify-center items-center bg-white/30 rounded-full"
          onPress={handleFlashModeChange}
        >
          <Ionicons
            name={
              flashMode === 'auto' ? 'flash-outline' : flashMode === 'on' ? 'flash' : 'flash-off'
            }
            size={24}
            color={flashMode === 'on' ? '#FF9500' : 'white'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
