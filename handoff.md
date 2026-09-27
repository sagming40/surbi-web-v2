# Surbi 프론트엔드 인수인계

## 현재 상태

- 작업 브랜치: `feature/wizard-api`
- 이번 작업 시작 기준 HEAD: `1ae7fbd feat: 04-05 창업 분석 API 연동`
- 아래 07·12 API 연동 변경은 이 문서를 작성하는 시점에는 아직 commit/push하지 않았다.
- `main`에는 직접 commit/push하지 않는다.
- 팀원의 `feature/shared-api`는 이미 현재 브랜치에 병합되어 있다.

## 이번 작업 완료: 07 AI 분석 보고서 + 12 창업 시뮬레이션 API 연동

### 07 AI 분석 보고서 (`/report`)

- `POST /api/v1/analysis-reports`를 실제 호출한다.
- 04에서 만든 요청 조건을 `WizardResultNavigationState`로 전달받아 같은 조건으로 보고서를 생성한다.
- 실제 응답의 분기 매출·점포 수·유동/상주/직장 인구·매출 증감률·순위·피크 시간·주요 고객을 표시한다.
- 현재 백엔드에 없는 ML 점수·예상 매출·폐업 위험도·자연어 요약은 임의 수치 대신 `준비 중`으로 표시한다.

### 12 창업 시뮬레이션 (`/simulation`)

- 실제 카카오맵은 유지하며, 위저드에서 진입할 경우 자치구·업종을 초기 필터로 가져온다.
- `GET /api/v1/bootstrap`으로 업종 목록을 조회한다.
- `GET /api/v1/areas`로 자치구·행정동 목록을, `GET /api/v1/commercial-areas`로 상권 목록을 조회한다.
- 후보 건물 API가 없으므로 기존 가짜 후보·지도 마커를 제거하고, 필요한 API와 데이터 항목을 화면에 명확히 안내한다.
- 자치구·행정동 API가 코드만 이름으로 반환하는 현재 백엔드 데이터 상태에서는 해당 코드가 사용자에게 노출되지 않도록 막는다.

### 추가한 API 구조

```text
src/shared/api/
  dto/analysisReport.ts          07 보고서 백엔드 DTO
  adapters/analysisReport.ts     DTO → 화면 데이터 변환
  analysisReport.ts              POST /analysis-reports
  useAnalysisReport.ts           보고서 mutation 훅
  dto/areas.ts                   지역·상권 DTO
  adapters/areas.ts              DTO → 화면 데이터 변환
  areas.ts                       지역·상권 조회 함수
  useAreas.ts                    지역·상권 React Query 훅

src/shared/types/
  analysisReport.ts              07 보고서 화면 타입
  areaSelection.ts               지역·상권 선택 타입
```

### 이번 검증 결과

- `npx tsc --noEmit --incremental false -p tsconfig.app.json` 통과
- 이번에 변경한 07·12 및 API 파일 대상 ESLint 통과
- `git diff --check` 통과
- `/wizard`에서 지역 목록과 실제 `bootstrap` 업종 10개 표시를 브라우저로 확인
- `npm run build`와 `npx vite build`는 코드 문제가 아니라 `node_modules/.tmp`, `.vite-temp` 파일이 다른 프로세스에 잠긴 Windows `EPERM` 오류로 완료하지 못했다. 개발 서버 또는 에디터가 해당 파일을 사용 중인지 확인한 뒤 다시 실행하면 된다.

## 이번 작업 완료: 04 창업계산 위저드 + 05 창업계산 결과

### 실제 백엔드 연결

1. **업종 목록**
   - `GET /api/v1/bootstrap`
   - 공용 `useBootstrap()`으로 외식업 10종을 캐시해 사용한다.

2. **창업 분석 생성**
   - `POST /api/v1/startup-analysis`
   - 04 마지막 `분석 결과 보기` 버튼에서 한 번만 호출한다.
   - 05는 API를 다시 호출하지 않고 04의 분석 결과를 재사용한다.

3. **05에서 실제 표시하는 값**
   - 분기 매출, 전분기 대비 매출 증감률, 점포 수, 서울 자치구 매출 순위

### 공용 API 구조

```text
src/shared/api/
  client.ts                       axios 공통 설정
  dto/startupAnalysis.ts          백엔드 snake_case DTO
  adapters/startupAnalysis.ts     DTO → 화면 camelCase 변환
  startupAnalysis.ts              POST 요청 함수
  useStartupAnalysis.ts           React Query mutation 훅

src/shared/types/analysis.ts      StartupAnalysisRequest / Response
src/shared/ui/DataStatusNotice/   임시·미제공 데이터 공통 안내 UI
```

화면은 snake_case·직접 fetch를 사용하지 않는다.

```text
WizardPage
  → useStartupAnalysis()
  → createStartupAnalysis()
  → apiClient
  → backend
```

### 04 → 05 데이터 흐름

- 04에서 선택한 지역·업종·매장 조건과 분석 응답을 `WizardResultNavigationState`로 05에 전달한다.
- 같은 브라우저 탭에서 05를 새로고침해도 `sessionStorage`의 마지막 결과를 재사용한다.
- `다시 계산`을 누르면 이전 세션 결과를 제거한다.

## 현재 백엔드 미제공·미반영 상태

화면에는 모두 공용 `DataStatusNotice`로 표시한다. 가짜 수치를 표시하지 않는다.

| 화면 | 상태 |
|---|---|
| 04 자치구 목록 | `/areas`의 이름이 코드로 내려와서 서울 자치구 일부 임시 목록 사용 |
| 04 선호 조건 | API 분석 계산에 미반영 |
| 04 매장 크기·층·직원 | 선택지는 mock, 요청에는 전달되지만 서버 계산에 미반영 |
| 05 임대료 | API 미제공 |
| 05 맞춤 지원 정책 | API 미제공 |
| 05 AI 점수·예측 | ML 모델 미준비이므로 시장 통계로만 표시 |

`startup-analysis`의 현재 `missing_capabilities`:

```text
RENT_DATA
SUPPORT_POLICY_DATA
STORE_INPUT_NOT_APPLIED
EMPLOYMENT_INPUT_NOT_APPLIED
```

## 확인한 실제 요청 결과

성동구(`11200`) + 양식음식점(`CS100004`) + 중형 86㎡ + 1층 + 직원 2명 요청 기준:

```text
status: PARTIAL
분기 매출: 8,413,890,940원
매출 증감률: 78.012%
점포 수: 359곳
서울 자치구 매출 순위: 10 / 25
```

## 오류 수정

- 위저드 첫 검색어의 `성동` 기본값 제거
- 서울 외 지역이 섞인 임시 목록 제거
- 서울 외 지역 분석 요청 시 발생하던 404 방지
- API 404·서버 연결 실패 시 사용자에게 구체적인 오류 문구 표시

## 로컬 실행

### 백엔드

백엔드 저장소에서 Docker Desktop 실행 후:

```powershell
docker compose -p surbi -f compose.yaml -f compose.local.yaml up -d db backend
```

확인:

```powershell
Invoke-WebRequest http://localhost:8000/health -UseBasicParsing
```

### 프론트

```powershell
npm install
npm run dev
```

- 프론트: `http://localhost:5000`
- 백엔드 Swagger: `http://localhost:8000/docs`
- Vite 프록시: `/api` → `http://localhost:8000`

## 검증 완료

- `npm run build` 성공
- `git diff --check` 성공
- `/wizard`에서 실제 분석 요청 후 `/wizard/result` 표시 확인

## 다음 작업

1. `POST /api/v1/analysis-reports` 기준으로 `ReportPage` API 연결
2. ML·AI 미제공 영역을 준비 상태로 표시
3. 백엔드 자치구 이름 데이터 수정 후 04 지역 목록의 mock 제거
4. 매장 조건·임대료·정책·ML API가 준비되면 해당 mock/상태 안내를 실제 값으로 교체
5. 이후 `SimulationPage`의 후보 건물 API 연결 검토
