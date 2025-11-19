import { Feather, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO: Move to a shared constants file
const CATEGORIES = [
  { id: 'fridge', name: '냉장' },
  { id: 'freezer', name: '냉동' },
  { id: 'room', name: '실온' },
  { id: 'cosmetics', name: '화장품' },
  { id: 'etc', name: '기타' },
];

const DURATION = 700;
const EASING = Easing.bezier(0.25, -0.5, 0.25, 1);
const REPEAT = 6;

export default function AddProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ imageUri: string; scannedExpiryDate: string }>();

  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
  const animatedBackgroundColor = useSharedValue('#FCFCFC');
  const animatedBorderColor = useSharedValue('#D1D5DB');

  const animatedTextInputStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedBackgroundColor.value,
    borderColor: animatedBorderColor.value,
  }));

  const animatedTextColor = useSharedValue('#8C8E98');
  const animatedTextStyle = useAnimatedStyle(() => ({
    color: animatedTextColor.value,
  }));

  useEffect(() => {
    if (params.scannedExpiryDate) {
      setExpiryDate(params.scannedExpiryDate);
      animatedBackgroundColor.value = withRepeat(
        withTiming('#E5EFFF', { duration: DURATION, easing: EASING }),
        REPEAT,
        true
      );
      animatedBorderColor.value = withRepeat(
        withTiming('#0061FF', { duration: DURATION, easing: EASING }),
        REPEAT,
        true
      );
      animatedTextColor.value = withRepeat(
        withTiming('#0061FF', { duration: DURATION, easing: EASING }),
        REPEAT,
        true
      );
    }
  }, [params.scannedExpiryDate]);

  const handleSave = () => {
    // TODO: Implement image compression and saving logic
    console.log({
      productName,
      expiryDate,
      category: selectedCategory,
    });
    // Navigate back to home screen after saving
    // router.navigate('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="h-header flex-row items-center justify-between px-4 border-b border-gray-200">
        <Pressable className="p-1" onPress={() => router.replace('/')}>
          <Feather name="x" size={24} color="#191D31" />
        </Pressable>
        <Text className="text-lg font-bold">상품 추가</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1 p-5" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="w-[200px] h-[200px] rounded-xl mx-auto mb-8 bg-gray-100 overflow-hidden items-center justify-center">
          {params.imageUri ? (
            <Image source={{ uri: params.imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <FontAwesome name="image" size={28} color="#8C8E98" />
          )}
        </View>

        {/* Form */}
        <View className="gap-y-7">
          <View>
            <Text className="text-base font-semibold mb-2">상품명</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-1 focus:outline-none"
              value={productName}
              onChangeText={setProductName}
              placeholder="예) 우유, 계란"
              placeholderTextColor="#8C8E98"
              autoComplete="off"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text className="text-base font-semibold mb-2">유통기한</Text>
            <AnimatedTextInput
              className="border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-1 focus:outline-none"
              style={animatedTextInputStyle}
              value={expiryDate}
              onChangeText={setExpiryDate}
              keyboardType="numeric"
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#8C8E98"
            />
            {params.scannedExpiryDate && (
              <Animated.Text style={animatedTextStyle} className="text-sm text-black-3 mt-2">
                스캔된 날짜가 정확한지 확인해주세요.
              </Animated.Text>
            )}
          </View>

          <View>
            <Text className="text-base font-semibold mb-2">카테고리</Text>
            <View className="flex-row flex-wrap gap-3">
              {CATEGORIES.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`px-5 py-2 rounded-full border ${
                    selectedCategory === category.id
                      ? 'bg-primary-1 border-primary-1'
                      : 'border-gray-300'
                  }`}
                >
                  <Text
                    className={`${
                      selectedCategory === category.id ? 'text-white font-bold' : 'text-black-1'
                    }`}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="flex-row px-5 pb-4" style={{ paddingBottom: insets.bottom || 20 }}>
        <Pressable
          onPress={handleSave}
          className="flex-1 bg-primary-1 rounded-lg items-center py-3"
        >
          <Text className="text-white text-lg font-bold">저장</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
