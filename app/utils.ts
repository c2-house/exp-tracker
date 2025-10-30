import dayjs from 'dayjs';
import type { Product, SortType } from './types';

export const calculateDaysLeft = (expDate: string) => {
  const today = dayjs().startOf('day');
  const expiry = dayjs(expDate);
  const daysLeft = expiry.diff(today, 'day');

  return daysLeft;
};

export const getDdayString = (daysLeft: number) => {
  return daysLeft < 0 ? `D+${Math.abs(daysLeft)}` : `D-${daysLeft}`;
};

export const sortProducts = (products: Product[], sortType: SortType) => {
  switch (sortType) {
    case '유통기한 임박순':
      return products.sort(
        (a, b) => new Date(a.exp_date).getTime() - new Date(b.exp_date).getTime()
      );
    case '최신 등록순':
      return products.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case '이름순':
      return products.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return products;
  }
};
