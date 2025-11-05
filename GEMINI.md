# 프로젝트: Shelfie (유통기한 트래커 앱)

개발을 시작하기 전에 이 `GEMINI.md` 파일과 `04_TASKS.md` 파일을 우선적으로 검토하세요.

## 1. 프로젝트 개요 (Summary)

- **목표:** OCR을 활용해 식품, 화장품 등의 유통기한을 쉽게 등록하고, 로컬 푸시 알림으로 잊지 않고 소비하도록 돕는 스마트 트래커 앱입니다.
- **핵심 가치:** 간편한 OCR 등록, 정확한 로컬 알림, 직관적인 목록 관리.

## 2. 핵심 아키텍처 원칙 (Key Architecture)

개발 시 반드시 다음 3가지 원칙을 준수해야 합니다.

1.  **Local-first (로컬 우선):** 모든 핵심 데이터(상품 정보, 설정)는 `AsyncStorage`에, 이미지는 `expo-file-system`에 저장됩니다. 모든 알림은 `expo-notifications`를 통한 **로컬 스케줄링**으로만 구현합니다.
2.  **Freemium (프리미엄) 모델:**
    - **Free:** 광고를 포함하며, 모든 핵심 기능(OCR, 로컬 알림 등)을 제공합니다.
    - **Premium:** 광고 제거 및 **'데이터 백업/복원'** 기능을 제공합니다.
3.  **백업 전용 백엔드:** Firebase(Auth, Firestore)는 오직 프리미엄 유저의 '백업' 및 '복원' 용도로만 사용합니다. MVP 단계에서 실시간 동기화나 서버 기반 FCM 알림 로직은 _절대_ 구현하지 않습니다.

## 3. 주요 문서 가이드 (Document Guide)

에이전트는 작업 수행 시 `docs/` 폴더의 문서들을 참고하세요.

- `01_PROJECT_PLAN.md`: 프로젝트의 전체적인 비전과 목표, 수익 모델을 이해할 때 참고합니다.
- `02_PRD.md`: (필수) 모든 기능 요구사항(User Stories)과 정책이 정의되어 있습니다. 기능 구현 전 _반드시_ 이 문서를 참고하세요.
- `03_WIREFRAMES.md`: (필수) 모든 화면 레이아웃과 UI/UX 흐름이 명세되어 있습니다. UI 구현 시 _반드시_ 이 문서를 참고하세요.
- `04_TASKS.md` (필수) 개발을 위한 구체적인 작업 순서와 파일 경로가 정의된 체크리스트입니다. 현재 작업할 내용을 여기서 찾으세요.
- `05_TECH_STACK.md` 사용할 라이브러리와 아키텍처 원칙이 요약되어 있습니다. 새 라이브러리 설치 전 이 문서를 확인하세요.

## 4. 주요 기술 스택 (Tech Stack)

- **Core:** React Native, Expo (Managed Workflow), TypeScript
- **Routing:** Expo Router (파일 시스템 기반 라우팅, 예: `app/index.tsx`, `app/product/[id].tsx`)
- **Styling:** NativeWind (Tailwind CSS)
- **Local Data:** `@react-native-async-storage/async-storage` (Metadata), `expo-file-system` (Images)
- **Core Libs:**
  - `expo-camera` (카메라)
  - `react-native-mlkit` (OCR)
  - `expo-image-manipulator` (이미지 압축)
  - `expo-notifications` (로컬 알림)
  - `react-native-gesture-handler` (스와이프)
  - `dayjs` (날짜 처리)
- **Premium Backend:** Firebase (Authentication, Firestore) - 백업/복원 전용
- **전역 상태 관리:** React Context API or Zustand

## 5. 주요 폴더 구조 (Folder Structure)

- `app/`: Expo Router의 라우트 스크린이 위치합니다.
  - `_layout.tsx`: 전역 레이아웃
  - `index.tsx`: 메인 목록 화면 (화면 1)
  - `add-product.tsx`: 카메라 촬영 화면 (화면 2)
  - `confirm-product.tsx`: OCR 결과 확인 화면 (화면 3)
  - `product/[id].tsx`: 상품 상세 화면 (화면 5)
  - `notifications.tsx`: 알림 목록 화면 (화면 6)
  - `settings.tsx`: 설정 화면 (푸시 알림 설정, 로그인 & 백업, 구독 관리 등)
- `components/`: 재사용 가능한 공용 컴포넌트
- `lib/`: 컴포넌트나 스크린이 아닌 공용 코드가 위치합니다.
  - `constants.ts`: 공용 상수 정의
  - `types.ts`: 공용 타입 정의
  - `utils.ts`: 공용 함수 정의

## 6. 코딩 규칙 (Coding Rules)

가독성 높고 유지보수하기 좋은 코드를 작성하기 위해 다음 규칙을 준수합니다.

1.  **절대 경로 임포트 사용**: 상대 경로(`../`, `./`) 대신 절대 경로(`@/`)를 사용하여 모듈을 임포트합니다. 이는 코드의 가독성을 높이고 리팩토링 시 발생할 수 있는 오류를 줄여줍니다.
2.  **타입스크립트 활용**: 타입스크립트의 강점을 최대한 활용하여 명확한 타입 정의와 안정적인 코드를 작성합니다.
3.  **컴포넌트 분리**: `app/` 경로에 스크린을 구현하다가 코드가 너무 길어지거나 재사용 가능한 컴포넌트가 있을 경우, `components/` 경로로 분리하여 모듈화합니다.
