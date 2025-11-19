import dayjs from 'dayjs';
import type { Product, SortType } from './types';

import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

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

/**
 * OCR 텍스트에서 유통기한 날짜를 추출하고 'YYYY-MM-DD' 형식으로 반환합니다.
 * 다양한 날짜 형식을 파싱하며, 현재 날짜와 비교하여 가장 적절한 날짜를 찾습니다.
 * @param text OCR로 인식된 전체 텍스트
 * @returns 'YYYY-MM-DD' 형식의 유통기한 날짜 문자열 또는 찾지 못한 경우 null
 */
export const extractExpiryDate = (text: string): string | null => {
  const today = dayjs().startOf('day');
  const currentYear = today.year();

  const cleanedText = text
    .replace(/[,\/\-]/g, '.') // 특수문자 ',' '-' '/'를 '.'으로 변경
    .replace(/\s*[년월]\s*/g, '.') // '년', '월' 및 주변 공백을 '.'으로 변경
    .replace(/(?<=(^|[^A-Za-z\d])\d{2,4})\s+(?=\d)/g, '.') // 2-4자리 숫자 사이의 공백을 '.'으로 변경
    .replace(/\s*\.\s*/g, '.') // '.' 주변의 공백 제거
    .replace(/[^A-Za-z\d.]/g, ' '); // 숫자와 알파벳 이외의 문자는 공백으로 변경

  // 다양한 날짜 형식을 찾기 위한 정규식
  const dateRegexPatterns = [
    /\d{4}\.\d{2}\.\d{2}/, // YYYY.MM.DD
    /\d{2}\.\d{2}\.\d{2}/, // YY.MM.DD
    /\d{2}\.\d{2}/, // MM.DD
    /\d{8}/, // YYYYMMDD
    /\d{2}\.\d{2}\.\d{4}/, // DD.MM.YYYY or MM.DD.YYYY
  ];

  const parsingFormats = [
    'YYYY.MM.DD',
    'YY.MM.DD',
    'MM.DD',
    'YYYYMMDD',
    'DD.MM.YYYY',
    'MM.DD.YYYY',
  ];

  const foundDates: dayjs.Dayjs[] = [];

  dateRegexPatterns.forEach((pattern) => {
    const regex = new RegExp(pattern.source, 'g');
    const matches = cleanedText.match(regex);

    if (matches) {
      matches.forEach((match) => {
        for (const format of parsingFormats) {
          let parsedDate = dayjs(match, format, true); // strict 모드로 파싱

          if (parsedDate.isValid()) {
            // MM.DD 포맷 처리: 연도가 없으면 현재 연도 또는 다음 연도 부여
            if (format === 'MM.DD') {
              const dateWithCurrentYear = parsedDate.year(currentYear);
              // 유통기한이 1개월 이상 지난 경우 다음 해로 설정
              if (dateWithCurrentYear.isBefore(today.subtract(1, 'month'))) {
                parsedDate = dateWithCurrentYear.add(1, 'year');
              } else {
                parsedDate = dateWithCurrentYear;
              }
            }

            // 너무 먼 과거(5년 전)나 너무 먼 미래(10년 후)의 날짜는 제외
            if (
              parsedDate.isAfter(today.subtract(5, 'year')) &&
              parsedDate.isBefore(today.add(10, 'year'))
            ) {
              foundDates.push(parsedDate);
            }
            break; // 첫 번째 유효한 포맷을 찾으면 중단
          }
        }
      });
    }
  });

  if (foundDates.length === 0) {
    return null;
  } else {
    // 날짜가 여러 개이면 가장 나중 날짜를 반환 (제조일자, 소비기한 모두 표기된 경우 대비)
    if (foundDates.length > 1) {
      foundDates.sort((a, b) => b.valueOf() - a.valueOf());
    }
    return foundDates[0].format('YYYY-MM-DD');
  }
};
