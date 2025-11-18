import CategoryFilter from '@/components/CategoryFilter';
import ProductListItem from '@/components/ProductListItem';
import SortModal from '@/components/SortModal';
import { categories, sampleItems, sortOptions } from '@/lib/constants';
import type { SortType } from '@/lib/types';
import { sortProducts } from '@/lib/utils';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
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

  const handleBlurSearch = () => {
    if (!searchQuery) {
      setIsSearchActive(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Header & Search */}
      <View className="flex-row items-center justify-between px-4 h-header">
        {isSearchActive ? (
          <View className="relative flex-1 flex-row items-center">
            <Feather name="search" size={24} color="#8C8E98" className="absolute left-3 z-10" />
            <TextInput
              className="flex-1 px-11 py-2.5 bg-white rounded-lg border border-gray-100 focus:border-primary-1 focus:outline-none"
              placeholder="상품 이름 검색"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onBlur={handleBlurSearch}
              autoComplete="off"
              autoCorrect={false}
              autoFocus
            />
            <Pressable onPress={handleCancelSearch} className="absolute right-3 z-10">
              <View className="w-6 h-6 items-center justify-center bg-gray-300 rounded-full">
                <Feather name="x" size={16} color="white" />
              </View>
            </Pressable>
          </View>
        ) : (
          <>
            <Text className="text-2xl font-bold text-black-1">Shelfie</Text>
            <View className="flex-row items-center gap-2">
              <Pressable className="p-1" onPress={() => setIsSearchActive(true)}>
                <Feather name="search" size={24} color="#191D31" />
              </Pressable>
              <Link href="/notifications" asChild>
                <Pressable className="p-1">
                  <Feather name="bell" size={24} color="#191D31" />
                </Pressable>
              </Link>
            </View>
          </>
        )}
      </View>

      <CategoryFilter currentCategory={currentCategory} onSelectCategory={setCurrentCategory} />

      {/* Count & Sort */}
      <View className="px-4 pt-5 pb-4 flex-row items-center justify-between">
        <Text className="text-black-2 font-semibold">총 {displayedItems.length}개</Text>
        <Pressable
          className="flex-row items-center gap-1"
          onPress={() => setSortModalVisible(true)}
        >
          <Image source={require('../assets/icons/arrow-up-down.png')} className="w-4 h-4" />
          <Text className="text-sm font-medium text-black-2">{currentSortType}</Text>
        </Pressable>
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
            <Text className="text-center text-base text-black-3">
              {searchQuery
                ? '검색 결과가 없습니다.'
                : '아직 등록된 상품이 없어요.\n아래 + 버튼을 눌러 첫 상품을 등록해보세요.'}
            </Text>
          </View>
        }
      />

      {/* 상품 추가 버튼 (Floating Action Button) */}
      <Link href="/scan-product" asChild>
        <Pressable
          className="absolute bottom-12 right-6 h-[64px] w-[64px] items-center justify-center rounded-full bg-primary-1 shadow-lg"
          style={{
            shadowColor: '#0061FF',
            shadowOpacity: 0.3,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 5,
          }}
        >
          <Feather name="plus" size={32} color="white" />
        </Pressable>
      </Link>

      <SortModal
        visible={sortModalVisible}
        onClose={() => setSortModalVisible(false)}
        currentSortType={currentSortType}
        onSelectSort={handleSelectSort}
      />
    </SafeAreaView>
  );
}
