import { Feather, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
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

  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (params.scannedExpiryDate) {
      setExpiryDate(params.scannedExpiryDate);
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
              value={productName}
              onChangeText={setProductName}
              placeholder="예) 우유, 계란"
              autoComplete="off"
              autoCorrect={false}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-1 focus:outline-none"
            />
          </View>

          <View>
            <Text className="text-base font-semibold mb-2">유통기한</Text>
            <TextInput
              value={expiryDate}
              onChangeText={setExpiryDate}
              keyboardType="numeric"
              placeholder="YYYY-MM-DD"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:border-primary-1 focus:outline-none"
            />
            {params.scannedExpiryDate && (
              <Text className="text-sm text-black-3 mt-2">
                스캔된 날짜가 정확한지 확인해주세요.
              </Text>
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
          className="flex-1 bg-primary-1 rounded-lg items-center py-4"
        >
          <Text className="text-white text-lg font-bold">저장</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
