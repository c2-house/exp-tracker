import { COLORS } from '@/lib/constants/colors';
import { extractExpiryDate } from '@/lib/utils/ocr';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import TextRecognition, { TextRecognitionScript } from '@react-native-ml-kit/text-recognition';
import { CameraView, useCameraPermissions, type FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Link, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ScanProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const [flashMode, setFlashMode] = useState<FlashMode>('auto');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-5">
        <Text className="text-center text-xl font-bold text-black-1">
          카메라 사용 권한이 필요해요.
        </Text>
        <Text className="text-center text-base text-black-2 mb-2">
          상품 등록을 위해 카메라 접근을 허용해주세요.
        </Text>
        <Pressable className="bg-primary-1 px-5 py-3 rounded-lg" onPress={requestPermission}>
          <Text className="text-white font-semibold">카메라 사용하기</Text>
        </Pressable>
        <Button onPress={() => Linking.openSettings()} title="설정 열기" />
      </View>
    );
  }

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    try {
      const result = await TextRecognition.recognize(uri, TextRecognitionScript.KOREAN);
      const expiryDate = extractExpiryDate(result.text);

      if (expiryDate) {
        router.push({
          pathname: '/add-product',
          params: { scannedExpiryDate: expiryDate, imageUri: uri },
        });
      } else {
        Alert.alert(
          '유통기한을 찾지 못했어요',
          '사진을 다시 찍거나, 직접 입력하기 버튼을 눌러주세요.'
        );
      }
    } catch (e) {
      console.error(e);
      Alert.alert('오류', '텍스트를 인식하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const takePicture = async () => {
    if (!permission?.granted) {
      Alert.alert(
        '카메라 접근 권한 필요',
        '이 기능을 사용하려면 설정에서 카메라 접근을 허용해주세요.',
        [{ text: '확인', onPress: () => Linking.openSettings() }]
      );
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        shutterSound: false,
      });
      if (photo?.uri) {
        await processImage(photo.uri);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '사진 접근 권한 필요',
        '이 기능을 사용하려면 설정에서 사진(저장공간) 접근을 허용해주세요.',
        [{ text: '확인', onPress: () => Linking.openSettings() }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      await processImage(result.assets[0].uri);
    }
  };

  const changeFlashMode = () => {
    setFlashMode((prev) => (prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto'));
  };

  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} flash={flashMode} style={styles.camera} />

      {/* Header */}
      <View
        className="absolute top-0 left-0 right-0 p-5 bg-black/50"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row justify-between items-center">
          <Pressable className="p-1" onPress={() => router.back()}>
            <Feather name="x" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-lg font-bold">유통기한 스캔</Text>
          <View className="w-8" />
        </View>
        <Text className="text-white text-base text-center mt-5">
          유통기한이 잘 보이게 찍어주세요.
        </Text>
      </View>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0">
        <Link
          replace
          href="/add-product"
          className="px-4 py-2 rounded-full w-fit mx-auto mb-4 bg-black/50 text-white font-semibold text-center"
        >
          직접 입력하기
        </Link>
        <View
          className="flex-row justify-between items-center px-10 pt-6 bg-black/50"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <TouchableOpacity
            className="w-14 h-14 justify-center items-center bg-white/30 rounded-full"
            onPress={pickImage}
            disabled={isProcessing}
          >
            <FontAwesome name="image" size={24} color="white" />
          </TouchableOpacity>
          <Pressable onPress={takePicture} disabled={isProcessing}>
            {({ pressed }) => (
              <View
                className={`w-[85px] h-[85px] justify-center items-center rounded-full bg-transparent border-[5px] border-white ${
                  pressed || isProcessing ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <View className="w-[70px] h-[70px] justify-center items-center rounded-full bg-white" />
              </View>
            )}
          </Pressable>
          <Pressable
            className="w-14 h-14 justify-center items-center bg-white/30 rounded-full"
            onPress={changeFlashMode}
            disabled={isProcessing}
          >
            <Ionicons
              name={
                flashMode === 'auto' ? 'flash-outline' : flashMode === 'on' ? 'flash' : 'flash-off'
              }
              size={24}
              color={flashMode === 'on' ? COLORS.status.warning : 'white'}
            />
          </Pressable>
        </View>
      </View>

      {/* Loading Indicator */}
      {isProcessing && (
        <View className="absolute inset-0 justify-center items-center bg-black/60 z-10">
          <ActivityIndicator size="large" color="white" />
          <Text className="text-white text-lg mt-4">사진을 분석하고 있어요...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: StyleSheet.absoluteFillObject,
});
