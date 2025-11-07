import type { Product, SortType } from '@/lib/types';

export const categories = ['전체', '냉장', '냉동', '실온', '화장품', '기타'];

export const sortOptions: SortType[] = ['유통기한 임박순', '최신 등록순', '이름순'];

export const sampleItems: Product[] = [
  {
    id: '1',
    name: '우유',
    exp_date: '2025-11-08',
    createdAt: '2025-10-28T10:00:00Z',
    category: '냉장',
  },
  {
    id: '2',
    name: '유기농 식빵',
    exp_date: '2025-11-04',
    createdAt: '2025-10-29T11:00:00Z',
    category: '실온',
  },
  {
    id: '3',
    name: '신선한 계란 (10구)',
    exp_date: '2025-11-30',
    createdAt: '2025-10-30T09:00:00Z',
    category: '냉장',
  },
  {
    id: '4',
    name: '아보카도',
    exp_date: '2025-11-20',
    createdAt: '2025-10-25T15:00:00Z',
    category: '실온',
  },
  {
    id: '5',
    name: '오렌지',
    exp_date: '2025-11-29',
    createdAt: '2025-10-22T10:00:00Z',
    category: '냉장',
  },
  {
    id: '6',
    name: '돈까스',
    exp_date: '2025-12-30',
    createdAt: '2025-09-28T10:00:00Z',
    category: '냉동',
  },
];
