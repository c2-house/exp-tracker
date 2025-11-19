import { AnimatedTextInput, useExpiryDateAnimation } from '@/lib/hooks/useExpiryDateAnimation';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO: Move to a shared constants file
const CATEGORIES = [
  { id: 'fridge', name: '냉장' },
  { id: 'freezer', name: '냉동' },
  { id: 'room', name: '실온' },
  { id: 'cosmetics', name: '화장품' },
  { id: 'etc', name: '기타' },
];

export default function AddProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ imageUri: string; scannedExpiryDate: string }>();

  const yearInputRef = useRef<TextInput>(null);
  const monthInputRef = useRef<TextInput>(null);
  const dayInputRef = useRef<TextInput>(null);

  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState({
    year: '',
    month: '',
    day: '',
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    handleFocus,
    handleBlur,
    animatedYearStyle,
    animatedMonthStyle,
    animatedDayStyle,
    animatedTextStyle,
  } = useExpiryDateAnimation(params.scannedExpiryDate);

  useEffect(() => {
    if (params.scannedExpiryDate) {
      const [year, month, day] = params.scannedExpiryDate.split('-');
      setExpiryDate({ year, month, day });
    }
  }, [params.scannedExpiryDate]);

  const handleSave = () => {
    // TODO: Implement image compression and saving logic
    console.log({
      name: productName,
      expiryDate: `${expiryDate.year}-${expiryDate.month}-${expiryDate.day}`,
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
              autoFocus={params.scannedExpiryDate ? false : true}
              returnKeyType={params.scannedExpiryDate ? 'done' : 'next'}
              onSubmitEditing={() => !params.scannedExpiryDate && yearInputRef.current?.focus()}
            />
          </View>

          <View>
            <Text className="text-base font-semibold mb-2">유통기한 (YYYY-MM-DD)</Text>
            <View className="flex-row items-center gap-x-1.5">
              <AnimatedTextInput
                ref={yearInputRef}
                className="border rounded-lg p-3 w-20"
                style={animatedYearStyle}
                value={expiryDate.year}
                onChangeText={(value) => setExpiryDate((prev) => ({ ...prev, year: value }))}
                onFocus={() => handleFocus('year')}
                onBlur={() => handleBlur('year')}
                placeholder="YYYY"
                placeholderTextColor="#8C8E98"
                textAlign="center"
                maxLength={4}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => monthInputRef.current?.focus()}
              />
              <Text className="text-lg">-</Text>
              <AnimatedTextInput
                ref={monthInputRef}
                className="border rounded-lg p-3 w-14"
                style={animatedMonthStyle}
                value={expiryDate.month}
                onChangeText={(value) => setExpiryDate((prev) => ({ ...prev, month: value }))}
                onFocus={() => handleFocus('month')}
                onBlur={() => handleBlur('month')}
                placeholder="MM"
                placeholderTextColor="#8C8E98"
                textAlign="center"
                maxLength={2}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => dayInputRef.current?.focus()}
              />
              <Text className="text-lg">-</Text>
              <AnimatedTextInput
                ref={dayInputRef}
                className="border rounded-lg p-3 w-14"
                style={animatedDayStyle}
                value={expiryDate.day}
                onChangeText={(value) => setExpiryDate((prev) => ({ ...prev, day: value }))}
                onFocus={() => handleFocus('day')}
                onBlur={() => handleBlur('day')}
                placeholder="DD"
                placeholderTextColor="#8C8E98"
                textAlign="center"
                maxLength={2}
                keyboardType="numeric"
              />
            </View>
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
