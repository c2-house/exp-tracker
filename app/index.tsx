import CategoryFilter from '@/components/CategoryFilter';
import ProductListItem from '@/components/ProductListItem';
import SortModal from '@/components/SortModal';
import { categories, sampleItems, sortOptions } from '@/lib/constants';
import type { SortType } from '@/lib/types';
import { sortProducts } from '@/lib/utils';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState(categories[0]);
  const [currentSortType, setCurrentSortType] = useState<SortType>(sortOptions[0]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const filteredItems = useMemo(() => {
    if (currentCategory === categories[0]) {
      return sampleItems;
    }
    return sampleItems.filter((item) => item.category === currentCategory);
  }, [currentCategory]);

  const sortedItems = useMemo(() => {
    const itemsCopy = [...filteredItems];
    return sortProducts(itemsCopy, currentSortType);
  }, [currentSortType, filteredItems]);

  const searchedItems = useMemo(() => {
    if (!searchQuery) {
      return sortedItems;
    }
    return sortedItems.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedItems, searchQuery]);

  const displayedItems = searchedItems;

  const handleSelectSort = (option: SortType) => {
    setCurrentSortType(option);
    setSortModalVisible(false);
  };

  const handleCancelSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  const handleBlur = () => {
    if (!searchQuery) {
      setIsSearchActive(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 h-header">
        {isSearchActive ? (
          <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 border border-gray-100 focus-within:border-primary-1">
            <Feather name="search" size={24} color="#666876" />
            <TextInput
              className="flex-1 mx-2 py-2.5 bg-white text-black-1 outline-none placeholder:text-black-3"
              placeholder="상품 이름 검색"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onBlur={handleBlur}
              autoFocus
            />
            <TouchableOpacity onPress={handleCancelSearch}>
              <View className="size-5 items-center justify-center bg-black-3/40 rounded-full">
                <Feather name="x" size={14} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="text-2xl font-bold text-black-1">Shelfie</Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity className="p-1" onPress={() => setIsSearchActive(true)}>
                <Feather name="search" size={24} color="#191D31" />
              </TouchableOpacity>
              <Link href="/notifications" asChild>
                <TouchableOpacity className="p-1">
                  <Feather name="bell" size={24} color="#191D31" />
                </TouchableOpacity>
              </Link>
            </View>
          </>
        )}
      </View>

      <CategoryFilter currentCategory={currentCategory} onSelectCategory={setCurrentCategory} />

      {/* Count & Sort */}
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
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
          <View className="mt-24 items-center justify-center">
            <Text className="text-center text-black-3">
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
        currentSortType={currentSortType}
        onSelectSort={handleSelectSort}
      />
    </SafeAreaView>
  );
}
