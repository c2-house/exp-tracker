import { categories } from '@/lib/constants';
import { Pressable, ScrollView, Text, View } from 'react-native';

type CategoryFilterProps = {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
};

export default function CategoryFilter({ currentCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3 px-4">
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => onSelectCategory(category)}
              className={`px-5 py-2 rounded-full border ${
                currentCategory === category
                  ? 'bg-primary-1 border-primary-1'
                  : 'bg-primary-3 border-primary-2'
              }`}
            >
              <Text
                className={`text-base ${
                  currentCategory === category ? 'text-white font-bold' : 'text-black-1'
                }`}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
