import CategoryFilter from '@/components/CategoryFilter';
import ProductListItem from '@/components/ProductListItem';
import SortModal from '@/components/SortModal';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Product, SortType } from './types';
import { sortProducts } from './utils';

const sampleItems: Product[] = [
  {
    id: '1',
    name: '우유',
    exp_date: '2025-11-08',
    image: 'https://placehold.co/100x100',
    createdAt: '2025-10-28T10:00:00Z',
    category: '냉장',
  },
  {
    id: '2',
    name: '유기농 식빵',
    exp_date: '2025-11-04',
    image: 'https://placehold.co/100x100',
    createdAt: '2025-10-29T11:00:00Z',
    category: '실온',
  },
  {
    id: '3',
    name: '신선한 계란 (10구)',
    exp_date: '2025-11-30',
    image: 'https://placehold.co/100x100',
    createdAt: '2025-10-30T09:00:00Z',
    category: '냉장',
  },
  {
    id: '4',
    name: '아보카도',
    exp_date: '2025-11-20',
    image: 'https://placehold.co/100x100',
    createdAt: '2025-10-25T15:00:00Z',
    category: '실온',
  },
  {
    id: '5',
    name: '오렌지',
    exp_date: '2025-11-29',
    image: 'https://placehold.co/100x100',
    createdAt: '2025-10-22T10:00:00Z',
    category: '냉장',
  },
  {
    id: '6',
    name: '돈까스',
    exp_date: '2025-12-30',
    image: 'https://placehold.co/100x100',
    createdAt: '2025-09-28T10:00:00Z',
    category: '냉동',
  },
];

const categories = ['전체', '냉장', '냉동', '실온', '화장품', '기타'];

const sortOptions: SortType[] = ['유통기한 임박순', '최신 등록순', '이름순'];

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState('전체');
  const [currentSortType, setCurrentSortType] = useState<SortType>('유통기한 임박순');
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const filteredItems = useMemo(() => {
    if (currentCategory === '전체') return sampleItems;
    return sampleItems.filter((item) => item.category === currentCategory);
  }, [currentCategory]);

  const sortedItems = useMemo(() => {
    const itemsCopy = [...filteredItems];
    return sortProducts(itemsCopy, currentSortType);
  }, [currentSortType, filteredItems]);

  const displayedItems = sortedItems;

  const handleSelectSort = (option: SortType) => {
    setCurrentSortType(option);
    setSortModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4">
        <Text className="text-2xl font-bold text-black-1">Shelfie</Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity>
            <Feather name="search" size={24} color="#191D31" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="bell" size={24} color="#191D31" />
          </TouchableOpacity>
        </View>
      </View>

      <CategoryFilter
        categories={categories}
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
      />

      {/* Count & Sort */}
      <View className="px-4 pt-6 pb-4 flex-row items-center justify-between">
        <Text className="text-black-2 font-semibold">총 {displayedItems.length}개</Text>
        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => setSortModalVisible(true)}
        >
          <MaterialIcons name="sort" size={16} color="#666876" />
          <Text className="text-sm font-medium text-black-2">{currentSortType}</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={displayedItems}
        renderItem={({ item }) => <ProductListItem item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4"
        contentContainerStyle={{ gap: 12, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <Text className="mt-4 text-center text-lg text-black-3">
              아직 등록된 상품이 없어요.{'\n'}아래 + 버튼을 눌러 첫 상품을 등록해보세요.
            </Text>
          </View>
        }
      />

      {/* 상품 추가 버튼 (Floating Action Button) */}
      <TouchableOpacity
        className="absolute bottom-10 right-6 h-16 w-16 items-center justify-center rounded-full bg-primary-1 shadow-lg"
        style={{
          shadowColor: '#0061FF',
          shadowOpacity: 0.3,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 4 },
          elevation: 5,
        }}
      >
        <Feather name="plus" size={32} color="white" />
      </TouchableOpacity>

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        onSelectSort={handleSelectSort}
        currentSortType={currentSortType}
        sortOptions={sortOptions}
      />
    </SafeAreaView>
  );
}
