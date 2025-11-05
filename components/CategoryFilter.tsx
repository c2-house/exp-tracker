import { categories } from '@/lib/constants';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type CategoryFilterProps = {
  currentCategory: string;
  onSelectCategory: (category: string) => void;
};

export default function CategoryFilter({ currentCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <View className="">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-3 px-4">
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => onSelectCategory(category)}
              className={`py-2 px-5 rounded-full border ${
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
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
