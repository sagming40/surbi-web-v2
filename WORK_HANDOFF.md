# Surbi v2 작업 인수인계 — 김성환

## 시작하기

- 작업 브랜치: `feature/wizard-report`
- `main`에는 직접 커밋하거나 푸시하지 않는다.
- 학교 PC에서는 작업 전 `feature/wizard-report` 브랜치에서 최신 내용을 내려받는다.
- `src/shared`는 팀 공용 영역이므로 수정하지 않는다.

## 현재 반영된 커밋

| 커밋 | 내용 |
| --- | --- |
| `8511a7e` | 04 창업계산 위저드: 목 API 연동, 1~6단계 분리, 결과 요청 연결 |
| `c38c91f` | 12 창업 시뮬레이션: 상단 필터와 목 데이터 연동 작업(WIP) |

## 담당 화면 상태

| 화면 | 경로 | 상태 |
| --- | --- | --- |
| 04 위저드 | `/wizard` | 1~6단계 구현 및 목 API 연결 완료 |
| 05 계산 결과 | `/wizard/result` | 기존 화면 유지. 위저드에서 목 결과 요청 후 이동 확인 완료 |
| 07 AI 보고서 | `/report` | 구현 완료 상태 유지 |
| 12 창업 시뮬레이션 | `/simulation` | 카카오 지도·후보 목록·필터 작업 진행 중 |

## 위저드 구조

`src/pages/WizardPage/` 아래에서 화면, 데이터, 디자인을 나눠 관리한다.

| 파일 | 역할 |
| --- | --- |
| `index.tsx` | 단계 이동과 선택값을 한 곳에서 관리하고 결과 요청을 시작한다. |
| `RegionStep.tsx` ~ `ReviewStep.tsx` | 각 단계의 화면만 담당한다. |
| `wizard.api.ts` | 목 호출과 실제 `fetch`로 교체할 위치를 관리한다. |
| `wizard.mock.ts` | 실제 API 응답과 같은 형태의 임시 데이터다. |
| `wizard.presenter.ts` | 화면 선택값을 API 요청값으로 변환한다. |
| `wizard.styles.ts` | 위저드 전용 배치·상태 스타일을 모은다. |
| `wizard.types.ts` | 아직 공용 명세에 없는 위저드 전용 타입이다. |

### 위저드 API

- `GET /api/geo/districts`: 지역 목록
- `GET /api/meta/categories`: 업종 목록
- `GET /api/meta/store-sizes?categoryCode=...`: 매장 크기 선택지 제안
- `GET /api/meta/store-floors?categoryCode=...`: 층수 선택지 제안
- `GET /api/meta/staffing-options?categoryCode=...`: 직원 수·근무시간 기준 제안
- `POST /api/wizard/result`: 분석 결과 생성. 공용 `WizardResultRequest`, `WizardResultResponse`를 사용한다.

현재 모든 API는 목 데이터로 동작한다. 실제 백엔드 연결 시 `wizard.api.ts` 안의 주석 처리된 `fetch` 코드만 활성화하면 화면 컴포넌트 구조는 그대로 유지된다.

직원 수 화면은 범위 선택만 제공하므로, 현재 분석 요청에서는 `1~4명`을 2명, `5명 이상`을 5명으로 변환한다. 백엔드가 범위 코드를 받거나 정확한 인원 입력을 받도록 확정되면 `wizard.presenter.ts`의 변환 규칙만 수정한다.

## 시뮬레이션 진행 상태

- 실제 Kakao Maps JavaScript SDK를 사용한다.
- 카카오 키는 `.env.local`의 `VITE_KAKAO_MAP_KEY`에만 저장한다. 이 파일은 Git에 올리지 않는다.
- 로컬 확인 주소는 `http://localhost:5000/simulation`이다.
- 상단 자치구·행정동·업종·상권 필터와 반경·경쟁 매장 제외 스위치는 목 응답에 반영된다.
- 다음 작업은 Figma 12번 화면과 비교해 필터 메뉴, 후보 목록, 지도 마커의 세부 UI를 다듬고 실제 API 연결 구조를 정리하는 것이다.

## 작업 원칙과 검증

- 새 작업 전 `src/shared/ui`, `src/shared/ui/charts`, `src/shared/types`, `src/shared/api`를 먼저 확인한다.
- 기존 공용 컴포넌트·타입은 새로 만들지 않는다. 새 공용 컴포넌트가 필요하면 팀에 먼저 공유한다.
- 화면 단위로 커밋하고, 커밋 전 빌드·변경 파일·공백 오류를 확인한다.
- 최근 위저드 작업은 `npm run build`, 위저드 ESLint, `git diff --check`, 브라우저 흐름 검증을 통과했다.
