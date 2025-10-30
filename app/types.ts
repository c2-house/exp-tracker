export interface Product {
  id: string;
  name: string;
  exp_date: string; // 'YYYY-MM-DD' 형식
  image: string;
  createdAt: string; // ISO 8601 날짜 문자열 (예: '2025-10-30T12:00:00Z')
}

export type StatusType = 'safe' | 'warning' | 'danger';

export type SortType = '유통기한 임박순' | '최신 등록순' | '이름순';
