# Shelfie MVP 개발 태스크

기준 문서: `03_WIREFRAMES.md`
현재 상태: 화면 1의 UI 및 정렬 로직, 데이터 구조(types, utils) 구현 완료.

## 0단계: 프로젝트 초기 설정

- [x] **Expo 프로젝트 생성** (Expo Router, TypeScript)
- [x] **NativeWind (Tailwind CSS) 설치** 및 `tailwind.config.js`, `babel.config.js` 설정 완료
- [x] **dayjs 라이브러리 설치**

## 1단계: 핵심 데이터 구조 및 유틸리티

- [x] **`app/types.ts` 생성**: `ProductItem`, `SortType`, `StatusType` 인터페이스 및 타입 정의 (PRD 1.3, 2.1.4)
- [x] **`app/utils.ts` 생성**: `dayjs`를 사용한 `getExpiryInfo` 함수 구현 (D-Day 및 Status 계산 로직)

## 2단계: 메인 화면 (화면 1: Main List Screen)

- [x] **기본 UI 구현**
  - `SafeAreaView` 및 `StatusBar` 설정
  - 헤더: 'Shelfie' 로고, 검색 아이콘, 알림 아이콘
  - 카테고리 필터: `ScrollView`를 사용한 가로 스크롤 버튼
  - 상품 개수 및 정렬 버튼
  - 상품 목록 `FlatList`: Mock Data `sampleItems` 사용
  - 상품 카드
  - Empty State (data가 없을 때)
  - 플로팅 액션 버튼 (FAB)
- [x] 상품 카드 D-Day, Status 계산 로직 구현 (PRD 2.1.4)
- [x] 정렬 기능 로직 구현: `useMemo`를 사용한 정렬 (임박순, 최신순, 이름순) (PRD 2.1.3)
- [x] 정렬 선택 모달 UI 및 로직 구현
- [x] **카테고리 필터링 로직 구현**
  - `useMemo`의 `sortedItems` 로직에 `currentCategory` 상태를 반영하여, 선택된 카테고리의 상품만 필터링되도록 로직을 추가합니다. ('전체'일 때는 모든 항목 표시)
- [x] **인라인 검색 UI 및 로직 구현**
  - 헤더의 '검색' 아이콘 탭 시, 헤더 영역이 검색창(`TextInput`)으로 변경되고, `sortedItems`가 실시간으로 필터링되도록 구현합니다. (별도 페이지 이동 X)
- [x] **알림 화면 연결**
  - 헤더의 '알림' 아이콘 탭 시, `expo-router`의 `Link`를 사용해 `app/notifications.tsx` 화면(와이어프레임 화면 5)으로 연결합니다. (Task 6에서 구현)

## 3단계: 상품 등록 흐름 (Flow 1: Add Product)

- [x] **화면 이동 설정 (Expo Router)**
  - `app/index.tsx`의 플로팅 액션 버튼(FAB)에 Link 컴포넌트를 적용하여, 새 상품 등록 화면(`app/scan-product.tsx`)으로 이동하도록 설정합니다.
- [x] **카메라 화면 UI 구현**
  - `expo-camera` 라이브러리를 설치하고, `app/scan-product.tsx`에서 사용자 권한을 요청하고 카메라 뷰가 나오도록 구현합니다.
  - 와이어프레임의 화면 2: 카메라 촬영 화면 UI(가이드라인, 컨트롤 버튼 등)를 구현합니다.
- [x] **카메라 촬영, 사진 선택 로직 구현**
  - 촬영 버튼을 누르면 사진 촬영
  - 갤러리 버튼을 누르면 갤러리에서 사진 선택
  - 플래시 버튼을 누르면 플래시 켜기/끄기
- [x] **OCR 기능 구현 (핵심)**
  - `react-native-mlkit` 라이브러리를 설치하고 설정합니다.
  - 촬영 버튼을 눌렀을 때 사진을 찍고, (원본 이미지를 바탕으로) ML Kit의 `recognizeText` 함수로 텍스트를 추출하는 로직을 구현합니다.
- [x] **유통기한 OCR 기능 구현 (핵심)**
  - `dayjs` 등을 활용해 다양한 날짜 형식(예: ~까지, YYYY년 MM월 DD일, YYYY.MM.DD, YY.MM.DD, MM/DD/YY, DD/MM/YY 등)을 찾는 정규식 로직을 구현합니다.
- [x] **유통기한 데이터 전달 로직 구현 (화면 2: 유통기한 스캐너)**
  - 기존에 구현된 `app/scan-product.tsx` 화면 하단에 '직접 입력하기' 버튼을 배치합니다.
  - OCR 성공 시: `router.replace('/add-product', { scannedExpiryDate: '...' })`를 사용하여 스캐너를 스택에서 지우고 폼으로 이동합니다.
  - OCR 실패 시: 화면 이동을 막고, Toast 컴포넌트를 사용해 실패 메시지를 띄우는 로직을 추가합니다.
  - 건너뛰기 시: `router.replace('/add-product')`으로 빈 폼으로 이동합니다.
- [ ] **`app/add-product.tsx` 구현 (화면 3: 등록 폼)**
  - 상품명, 카테고리, 유통기한을 입력받는 폼 UI를 구현합니다.
  - `useLocalSearchParams`를 통해 이전 화면에서 넘겨준 `scannedExpiryDate`(string)를 받습니다.
  - `scannedExpiryDate`가 있으면:
    - 유통기한 state를 해당 값으로 업데이트합니다.
    - `react-native-reanimated` 등을 사용하여 유통기한 입력 필드에 일회성 강조 애니메이션을 적용합니다.
    - 유통기한 입력 필드 하단에 날짜 확인을 유도하는 문구를 표시합니다.
- [ ] **저장 로직 구현**
  - `@react-native-async-storage/async-storage` 라이브러리를 설치합니다.
  - `app/add-product.tsx`(폼 화면)에서 '저장' 버튼을 누르면, 폼의 모든 데이터를 취합하여 `AsyncStorage`에 추가하고, 메인 화면(`app/index.tsx`)으로 복귀합니다.
  - 데이터가 정상적으로 저장되면 메인 화면 하단에 토스트 팝업을 표시합니다.
  - 앱 시작 시 `AsyncStorage`에서 데이터를 비동기적으로 불러와 더미 데이터 `sampleItems`를 대체합니다.

## 4단계: 상품 수정/삭제 흐름

상품 상세 화면 및 메인 화면에서 상품 정보를 수정/삭제하는 흐름을 구현합니다.

### 상품 상세 화면 (Flow 2: Product Detail / Wireframe 화면 5)

- [ ] **동적 라우트 생성: `app/product/[id].tsx` (화면 5: 상세)**
  - Expo Router의 동적 라우트 기능을 사용하여 상세 페이지를 생성합니다.
  - `useLocalSearchParams` 훅을 사용하여 id 값을 가져옵니다.
- [ ] **메인 목록에서 상세 화면으로 이동**
  - `app/index.tsx`의 FlatList renderItem에 있는 Pressable을 Link 컴포넌트로 변경하여, `href="/product/ITEM_ID"`로 연결합니다.
- [ ] **상세 화면 UI 구현**
  - `app/product/[id].tsx`에서 `AsyncStorage`를 id로 검색하여 상품 정보를 찾습니다.
  - 와이어프레임(v1.3)의 화면 5 UI(정보 표시, 재고 상태 버튼 그룹, 개봉 여부 토글)를 구현합니다.
- [ ] **'저장하기' (수정) 로직 구현**
  - 상세 화면에서 정보가 변경되었을 때 '저장하기' 버튼이 활성화되도록 상태 관리를 구현합니다.
  - 버튼 클릭 시 `sampleItems` 배열(추후 로컬 저장소)의 해당 아이템을 업데이트하는 로직을 구현합니다.
- [ ] **상세 화면 '삭제' 로직 구현**
  - 헤더의 휴지통 아이콘 클릭 시 '삭제 이유' 팝업 표시 및 삭제 로직을 구현합니다.

### 메인 화면 (PRD 2.2 / Wireframe 화면 1.3)

- [ ] **목록 아이템 제스처 구현 (스와이프/길게 누르기)**
  - `react-native-gesture-handler`의 `Swipeable` 컴포넌트를 `FlatList`의 `renderItem`에 적용하여, 왼쪽 스와이프 시 [삭제] 버튼이 나오도록 구현합니다.
  - `Pressable`에 `onLongPress` 속성을 추가하여, 길게 누를 시 Context Menu(빠른 조작 메뉴)가 나타나도록 구현합니다.
- [ ] **'삭제' 확인 모달 및 로직 구현**
  - '스와이프 > [삭제]' 또는 '길게 누르기 > [삭제]' 시, 와이어프레임에 명시된 "삭제 이유를 묻는 확인 팝업" (선택지: '유통기한 지나 폐기', '실수로 잘못 등록')을 구현합니다.
  - 선택에 따라 `AsyncStorage`에서 해당 아이템을 제거하는 로직을 구현합니다.

## 5단계: 푸시 알림 (Flow 3: Notifications)

PRD(Epic 3) 및 와이어프레임(화면 5)에 명시된 핵심 푸시 알림 기능을 구현합니다.

- [ ] **알림 라이브러리 설치**
  - `expo-notifications` 라이브러리를 설치하고 설정합니다.
- [ ] **알림 권한 요청 로직 구현**
  - 앱 최초 실행 시 (예: `app/_layout.tsx` 또는 `app/index.tsx` 진입 시) 푸시 알림 권한을 요청하는 로직을 구현합니다. (PRD 3.1.1)
- [ ] **새 화면 생성: `app/notifications.tsx` (화면 5: 알림 목록)**
  - 와이어프레임(v1.3, 화면 5)의 '알림 목록 화면' UI를 구현합니다.
  - (MVP) 우선 로컬에 저장된 알림 이력(또는 임박 상품 목록)을 보여주거나, (MVP 이후) Firebase와 연동된 알림 메시지를 표시합니다.
- [ ] **로컬 알림 스케줄링 로직 구현 (핵심)**
  - **상품 등록/수정 시:** `app/confirm-product.tsx` 또는 `app/product/[id].tsx`에서 '등록하기' 또는 '저장하기' 로직이 실행될 때, `expo-notifications`의 `scheduleNotificationAsync` 함수를 사용합니다.
  - **스케줄링 기준:** PRD(3.1.2) 및 기획안(Phase 1)에 따라, 사용자가 설정한 기준(예: D-7, D-3, D-1, 당일)에 맞춰 *여러 개의 로컬 알림을 미리 스케줄링*합니다.
  - **알림 취소:** 상품이 수정되거나 삭제/사용 완료될 경우, 기존에 스케줄링된 알림을 `cancelScheduledNotificationAsync` 함수로 취소하고 필요시 다시 스케줄링합니다.
- [ ] **알림 탭 핸들링 로직 구현**
  - 사용자가 푸시 알림(로컬 알림)을 탭했을 때, 앱이 열리면서 해당 상품의 상세 화면(`app/product/[id]`)으로 자동 이동하도록 `expo-notifications`의 리스너(Listener)를 설정합니다. (PRD 3.1.4)

---

<details>
  <summary>6단계: 프리미엄 백업 (Premium Backup)</summary>
  
  > **[개발 아키텍처 A-note]**
  >
  > - **Local-first 전략:** MVP는 비용 절감, 오프라인 지원, 빠른 속도를 위해 기기 내 로컬 저장을 기본으로 합니다.
  > - **이미지 처리:** 원본 이미지가 아닌, 압축된 썸네일(URI 또는 base64)을 저장하여 용량 문제를 해결합니다.
  > - **프리미엄 백업:** Firebase는 유료 사용자의 '백업/복원'을 위해서만 사용하며, 실시간 동기화나 서버 알림용이 아님.
  
  - [ ] **'설정'** 화면 및 '백업' 버튼 UI 생성
    - 간단한 '설정' 페이지 (`app/settings.tsx`)를 만들고, '데이터 백업 및 동기화' 버튼을 구현합니다. (헤더 아이콘 등에서 진입)
  - [ ] **(프리미엄) Firebase 프로젝트 생성 및 설정**
    - Firebase 콘솔에서 새 프로젝트를 생성하고, firebase SDK를 설치 및 초기화합니다.
  - [ ] **(프리미엄) Firebase 정식 인증 구현**
    - '백업' 버튼 클릭 시, Firebase 정식 로그인(Google, Apple 등)을 요청하는 화면을 구현합니다. (PRD 4.1)
  - [ ] **(프리미엄) Firebase 데이터 동기화 로직 구현 (백업/복원)**
    - **백업:** 로그인 성공 시, 로컬 `AsyncStorage`의 모든 데이터를 Firestore에 업로드(병합)하는 로직을 구현합니다. (PRD 4.1)
    - **복원:** 새 기기에서 로그인 시 데이터를 다운로드하는 로직을 구현합니다. (PRD 4.2)
    - **복원 후 알림 재설정:** 복원 완료 후, 로컬 알림을 다시 스케줄링하는 로직을 호출합니다. (PRD 4.2.3)
  - [ ] **(프리미엄) 이미지 로컬 저장 및 Storage 동기화**
    - (3단계에서 구현한) 압축된 이미지를 로컬 파일 시스템(`expo-file-system`)에 저장하고, `AsyncStorage`에는 `file://` URI를 저장합니다.
    - '백업' 실행
</details>
