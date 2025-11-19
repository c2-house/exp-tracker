import { COLORS } from '@/lib/constants/colors';
import type { Product } from '@/lib/types';
import { calculateDaysLeft, getDdayString } from '@/lib/utils/date';
import { FontAwesome } from '@expo/vector-icons';
import { Image, Pressable, Text, View } from 'react-native';

export default function ProductListItem({ item }: { item: Product }) {
  const daysLeft = calculateDaysLeft(item.expiryDate);

  return (
    <Pressable
      className="flex-row items-center rounded-2xl border border-gray-100 bg-white p-3 pr-4 shadow-sm"
      style={{
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} className="h-20 w-20 rounded-lg" resizeMode="cover" />
      ) : (
        <View className="h-20 w-20 rounded-lg items-center justify-center bg-gray-100 overflow-hidden">
          <FontAwesome name="image" size={24} color={COLORS.black[3]} />
        </View>
      )}
      {/* 상품명, 유통기한 */}
      <View className="mx-4 flex-1">
        <Text className="text-lg font-semibold text-black-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-sm text-black-2 mt-2">{item.expiryDate.replace(/-/g, '.')} 까지</Text>
      </View>
      {/* D-Day */}
      <View>
        <Text
          className={`text-lg font-bold ${
            daysLeft <= 0
              ? 'text-status-danger'
              : daysLeft <= 5
              ? 'text-status-warning'
              : 'text-status-safe'
          }`}
        >
          {getDdayString(daysLeft)}
        </Text>
      </View>
    </Pressable>
  );
}
