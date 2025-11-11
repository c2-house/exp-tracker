import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// TODO: Move to a shared constants file
const CATEGORIES = [
  { id: 'fridge', name: '냉장' },
  { id: 'freezer', name: '냉동' },
  { id: 'room', name: '실온' },
  { id: 'cosmetics', name: '화장품' },
  { id: 'etc', name: '기타' },
];

export default function ConfirmProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ imageUri: string; recognizedText: string }>();

  const [productName, setProductName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // TODO: Parse recognizedText to pre-fill productName and expiryDate
  useState(() => {
    if (params.recognizedText) {
      // For now, put all text in product name
      setProductName(params.recognizedText.replace(/\n/g, ' '));
    }
  });

  const handleSave = () => {
    // TODO: Implement image compression and saving logic
    console.log({
      productName,
      expiryDate,
      category: selectedCategory,
      imageUri: params.imageUri,
    });
    // Navigate back to home screen after saving
    router.navigate('/');
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="h-14 flex-row items-center justify-between px-4 border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="p-1">
          <Feather name="x" size={24} color="black" />
        </Pressable>
        <Text className="text-lg font-bold">상품 정보 확인</Text>
        <View className="w-8" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
        {params.imageUri && (
          <Image source={{ uri: params.imageUri }} style={styles.image} resizeMode="contain" />
        )}

        {/* Form */}
        <View className="gap-y-6">
          <View>
            <Text className="text-base font-semibold mb-2">상품명</Text>
            <TextInput
              value={productName}
              onChangeText={setProductName}
              placeholder="예: 서울우유 1L"
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            />
          </View>

          <View>
            <Text className="text-base font-semibold mb-2">유통기한</Text>
            <TextInput
              value={expiryDate}
              onChangeText={setExpiryDate}
              placeholder="YYYY-MM-DD"
              className="border border-gray-300 rounded-lg px-4 py-3 text-base"
            />
            {/* TODO: Add date picker */}
          </View>

          <View>
            <Text className="text-base font-semibold mb-2">카테고리</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full border ${selectedCategory === category.id
                      ? 'bg-primary-1 border-primary-1'
                      : 'border-gray-300'
                    }`}
                >
                  <Text
                    className={`${selectedCategory === category.id ? 'text-white' : 'text-black'}`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View
        className="flex-row px-5 pb-4 gap-x-3"
        style={{ paddingBottom: insets.bottom || 20 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="flex-1 bg-gray-200 rounded-lg items-center py-4"
        >
          <Text className="text-base font-bold">취소</Text>
        </Pressable>
        <Pressable
          onPress={handleSave}
          className="flex-1 bg-primary-1 rounded-lg items-center py-4"
        >
          <Text className="text-white text-base font-bold">저장</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
});
