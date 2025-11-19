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

  const animatedBackgroundColor = useSharedValue('#FCFCFC');
  const animatedBorderColor = useSharedValue('#D1D5DB');
  const animatedTextColor = useSharedValue('#8C8E98');

  const repeatedTiming = (toValue: string) =>
    withRepeat(withTiming(toValue, { duration: DURATION, easing: EASING }), REPEAT, true);

  useEffect(() => {
    if (scannedExpiryDate) {
      animatedBackgroundColor.value = repeatedTiming('#E5EFFF');
      animatedBorderColor.value = repeatedTiming('#0061FF');
      animatedTextColor.value = repeatedTiming('#0061FF');
    }
  }, [scannedExpiryDate]);

  const animatedYearStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedBackgroundColor.value,
    borderColor: isFocused.year ? '#0061FF' : animatedBorderColor.value,
  }));

  const animatedMonthStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedBackgroundColor.value,
    borderColor: isFocused.month ? '#0061FF' : animatedBorderColor.value,
  }));

  const animatedDayStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedBackgroundColor.value,
    borderColor: isFocused.day ? '#0061FF' : animatedBorderColor.value,
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
