import type { Product } from '@/lib/types';
import { calculateDaysLeft, getDdayString } from '@/lib/utils';
import { Image, Pressable, Text, View } from 'react-native';

export default function ProductListItem({ item }: { item: Product }) {
  const daysLeft = calculateDaysLeft(item.exp_date);

  return (
    <Pressable
      className="flex-row items-center rounded-2xl border border-gray-100 bg-white p-3 pr-4 shadow-sm"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: item.image }}
        className="h-20 w-20 rounded-lg bg-gray-100"
        resizeMode="cover"
      />
      {/* 상품명, 유통기한 */}
      <View className="mx-4 flex-1">
        <Text className="text-lg font-semibold text-black-1" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-sm text-black-2 mt-2">{item.exp_date.replace(/-/g, '.')} 까지</Text>
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
