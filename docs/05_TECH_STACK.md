# Shelfie 앱 기술 스택

기준 문서: `01_PROJECT_PLAN.md`, `04_TASKS.md`

## 1. 아키텍처 원칙 (Architecture Principles)

- **Local-first (로컬 우선):** MVP는 비용 절감, 오프라인 지원, 빠른 속도를 위해 기기 내 로컬 저장을 기본 전략으로 합니다. 모든 핵심 데이터와 알림 로직은 서버(백엔드) 없이 기기 내에서 완결됩니다. (Task 5. [A-note])
- **프리미엄 백업 (Premium Backup):** Firebase는 유료 구독자를 위한 '데이터 백업 및 복원' 기능으로만 제한적으로 사용됩니다. MVP 단계에서 실시간 동기화 또는 서버 기반 로직(FCM)은 사용하지 않습니다.
- **이미지 최적화:** 원본 이미지가 아닌, `expo-image-manipulator`로 압축/리사이징된 이미지만을 로컬과 서버에 저장하여 앱 용량과 전송 비용을 최소화합니다. (Task 3. 이미지 처리)

## 2. 핵심 기술 스택 (Core Stack)

- **Core Framework:** React Native
- **Development Environment:** Expo (Managed Workflow)
- **Language:** TypeScript

## 3. UI 및 스타일링 (UI & Styling)

- **Styling:** NativeWind (React Native를 위한 Tailwind CSS)
- **Gestures:** `react-native-gesture-handler`
  - **목적:** 메인 목록의 '스와이프하여 삭제', '길게 눌러 메뉴 표시' 기능 구현 (Task 4. 목록 아이템 제스처)

## 4. 내비게이션 (Navigation)

- **Router:** Expo Router
  - **목적:** 파일 시스템 기반 라우팅, 동적 라우트(`app/product/[id].tsx`), 파라미터 전달(`params`) (Task 3, 4)

## 5. 핵심 기능 라이브러리 (Core Feature Libraries)

- **OCR (광학 문자 인식):** `react-native-mlkit` (Text Recognition 모듈)
  - **목적:** 촬영된 이미지에서 유통기한 텍스트 추출 (Task 3. OCR 기능 구현)
- **Camera:** `expo-camera`
  - **목적:** '화면 2.5: 유통기한 OCR 스캐너' 구현 및 사용자 권한 요청 (Task 3. 카메라 기능 구현)
- **Push Notifications:** `expo-notifications`
  - **목적:** 푸시 알림 권한 획득, 로컬 알림 스케줄링(D-Day 알림), 알림 탭 핸들링 (Task 6. 푸시 알림)

## 6. 데이터 관리 (Data Management - Local)

- **Metadata Storage:** `@react-native-async-storage/async-storage`
  - **목적:** 상품 정보(JSON), 사용자 설정 등 텍스트 기반 데이터를 기기에 영구 저장 (Task 5. 로컬 저장소 설정)
- **Image File Storage:** `expo-file-system`
  - **목적:** 압축된 이미지 파일을 로컬 파일 시스템에 저장하고, `AsyncStorage`에는 `file://` URI를 저장 (Task 5. [A-note], 이미지 로컬 저장)

## 7. 백엔드 (프리미엄 백업 기능) (Backend - Premium Backup Feature)

- **Backend:** Firebase
- **Database:** Firestore
  - **목적:** 프리미엄 사용자가 '백업' 선택 시, 로컬 데이터를 사용자의 UID와 연결하여 클라우드에 저장 (Task 5. Firebase 데이터 동기화)
- **Authentication:** Firebase Authentication
  - **목적:** Google, Apple 등 정식 로그인을 통해 사용자를 식별하고 데이터 백업/복원을 위한 영구 UID 확보 (Task 5. Firebase 정식 인증)

## 8. 유틸리티 (Utilities)

- **Date/Time:** `dayjs`
  - **목적:** D-Day 계산, 날짜 포맷팅 등 앱 전반의 날짜 관련 로직 처리 (Task 1. utils.ts)
