import { COLORS } from '@/lib/constants/colors';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const DURATION = 700;
const EASING = Easing.bezier(0.25, -0.5, 0.25, 1);
const REPEAT = 6;

export const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export function useExpiryDateAnimation(scannedExpiryDate?: string) {
  const [isFocused, setIsFocused] = useState({
    year: false,
    month: false,
    day: false,
  });

  const handleFocus = (field: 'year' | 'month' | 'day') => {
    setIsFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: 'year' | 'month' | 'day') => {
    setIsFocused((prev) => ({ ...prev, [field]: false }));
  };

  const animatedBackgroundColor = useSharedValue<string>(COLORS.background);
  const animatedBorderColor = useSharedValue<string>(COLORS.gray[300]);
  const animatedTextColor = useSharedValue<string>(COLORS.black[3]);

  const repeatedTiming = (toValue: string) =>
    withRepeat(withTiming(toValue, { duration: DURATION, easing: EASING }), REPEAT, true);

  useEffect(() => {
    if (scannedExpiryDate) {
      animatedBackgroundColor.value = repeatedTiming(COLORS.primary[2]);
      animatedBorderColor.value = repeatedTiming(COLORS.primary[1]);
      animatedTextColor.value = repeatedTiming(COLORS.primary[1]);
    }
  }, [scannedExpiryDate]);

  const animatedYearStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedBackgroundColor.value,
    borderColor: isFocused.year ? COLORS.primary[1] : animatedBorderColor.value,
  }));

  const animatedMonthStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedBackgroundColor.value,
    borderColor: isFocused.month ? COLORS.primary[1] : animatedBorderColor.value,
  }));

  const animatedDayStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedBackgroundColor.value,
    borderColor: isFocused.day ? COLORS.primary[1] : animatedBorderColor.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: animatedTextColor.value,
  }));

  return {
    isFocused,
    handleFocus,
    handleBlur,
    animatedYearStyle,
    animatedMonthStyle,
    animatedDayStyle,
    animatedTextStyle,
  };
}
