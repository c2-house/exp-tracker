import { sortOptions } from '@/lib/constants/products';
import type { SortType } from '@/lib/types';
import { Modal, Pressable, Text, View } from 'react-native';

type SortModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectSort: (option: SortType) => void;
  currentSortType: SortType;
};

export default function SortModal({
  visible,
  onClose,
  onSelectSort,
  currentSortType,
}: SortModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable className="flex-1 items-center justify-center bg-black/50" onPress={onClose}>
        <View className="w-4/5 max-w-xs rounded-2xl bg-white shadow-lg">
          <View className="p-2">
            {sortOptions.map((option) => (
              <Pressable
                key={option}
                className="rounded-lg p-4"
                onPress={() => onSelectSort(option)}
              >
                <Text
                  className={`text-center text-lg ${
                    currentSortType === option ? 'text-primary-1 font-bold' : 'text-black-1'
                  }`}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
          <View className="border-t border-gray-200">
            <Pressable className="rounded-lg p-4" onPress={onClose}>
              <Text className="text-center text-lg text-status-danger">취소</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
