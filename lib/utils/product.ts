import type { Product, SortType } from '@/lib/types';

export const sortProducts = (products: Product[], sortType: SortType) => {
  switch (sortType) {
    case '유통기한 임박순':
      return products.sort(
        (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
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
