# Surbi 프론트엔드 작업 인수인계

## 현재 브랜치와 기준

- 작업 브랜치: `feature/wizard-api`
- 기준 브랜치: `feature/map`
- `feature/map`은 기존 `feature/wizard-report`의 작업을 모두 포함한 통합 상태다.
- `main`에는 직접 commit/push하지 않는다.
- `src/shared`는 팀 공용 영역이므로 이번 작업에서 수정하지 않았다.

## 이번 작업: 04 창업계산 위저드 API 연동

### 실제 API로 연결된 부분

1. **업종 목록**
   - 프론트: `GET /api/v1/bootstrap`
   - 사용 데이터: `industries` 중 `CS100...` 코드의 외식업 10종
   - 화면: `/wizard` 2단계에서 실제 DB 업종 10개가 표시된다.

2. **창업 분석 요청**
   - 프론트: `POST /api/v1/startup-analysis`
   - 실행 시점: `/wizard` 마지막 단계의 `분석 결과 보기` 버튼
   - 전달 값: 자치구, 업종, 매장 크기, 층수, 직원 수, 주 15시간 이상 근무 여부
   - 실제 응답에서 표시 중인 값: 분기 매출, 매출 증감률, 점포 수

3. **Vite 개발 프록시**
   - `vite.config.ts`에 `/api` → `http://localhost:8000` 프록시를 추가했다.
   - 프론트 API 호출은 서버 주소를 직접 쓰지 않고 `/api/v1/...` 형식을 사용한다.

### 수정한 파일

- `vite.config.ts`
- `src/pages/WizardPage/index.tsx`
- `src/pages/WizardPage/wizard.api.ts`
- `src/pages/WizardPage/wizard.presenter.ts`
- `src/pages/WizardPage/wizard.types.ts`
- `src/pages/WizardResultPage/index.tsx`

## 구조와 역할

```text
WizardPage/index.tsx
  선택 상태 관리, 마지막 API 요청, 결과 화면 이동

WizardPage/wizard.presenter.ts
  UI 선택값을 백엔드 POST 요청 형식으로 변환

WizardPage/wizard.api.ts
  fetch 호출, 백엔드 응답을 프론트에 전달

WizardResultPage/index.tsx
  navigate state의 wizardResult를 읽어 실제 데이터 일부를 표시
```

## 백엔드 로컬 실행

백엔드 저장소는 프론트와 나란한 경로에 있다.

```text
C:\Projects\surbi
```

Docker Desktop을 실행한 뒤 아래 명령을 사용한다.

```powershell
docker compose -p surbi -f compose.yaml -f compose.local.yaml up -d db backend
docker compose -p surbi -f compose.yaml -f compose.local.yaml ps
```

정상 상태:

```text
surbi-db-1: healthy
surbi-backend-1: healthy
0.0.0.0:8000->8000/tcp
```

Health 확인:

```powershell
Invoke-WebRequest http://localhost:8000/health -UseBasicParsing
```

Swagger:

```text
http://localhost:8000/docs
```

## DB dump

- 파일명: `surbi_final_candidate_20260920_r1.dump`
- 로컬 다운로드 경로: `C:\Users\HAPPY\Downloads\surbi_final_candidate_20260920_r1.dump`
- dump는 Git에 올리지 않는다.
- 현재 PC DB 복원은 완료되어 있다.

## 확인된 백엔드 제공 범위

### 현재 실제 반영됨

- 자치구 코드
- 업종 코드
- 해당 지역·업종 기준 시장 통계

### 요청에는 포함되지만 아직 계산에 반영되지 않음

- 매장 크기
- 층수
- 직원 수
- 주 15시간 이상 근무 여부

`StartupAnalysisService`는 현재 `area`와 `industry_code`만 시장 통계 조회에 사용한다. 따라서 매장 크기·층수·직원 조건을 바꿔도 API 결과는 현재 달라지지 않는다.

### 현재 백엔드에 없는 데이터

- 임대료
- 지원 정책
- AI 점수·등급
- 예상 월매출
- 폐업 위험도
- AI 요약 문장
- 후보 건물 단위 창업 시뮬레이션 데이터

결과 화면에는 아직 임대료·AI 점수·지원 정책의 기존 mock UI가 남아 있다. 실제 API가 제공하지 않는 수치를 실제 결과처럼 표시하지 않도록, 다음 작업에서 `데이터 준비 중` 처리 또는 UI 조정이 필요하다.

## 백엔드에 전달한 이슈

`GET /api/v1/areas?unit=GU&format=selection` 응답에서 `name`이 실제 자치구명 대신 코드로 반환된다.

```json
{ "code": "11200", "name": "11200" }
```

위저드 1단계 지역 선택을 실제 API로 바꾸려면 `name: "성동구"`처럼 사람이 읽는 지역명이 필요하다. 백엔드 담당자에게 수정 요청을 전달한 상태다.

## 다음 작업 순서

1. 백엔드의 자치구·행정동 이름 응답 수정 여부 확인
2. `WizardPage` 1단계 지역 목록을 `GET /api/v1/areas`로 교체
3. `WizardResultPage`에 남은 mock 임대료·AI 점수·정책 영역을 실제 제공 범위에 맞게 정리
4. `POST /api/v1/analysis-reports` 응답 범위를 확인한 뒤 `ReportPage` 연결
5. 건물 단위 후보 API와 건물 geometry가 준비된 뒤 `SimulationPage` 연결

## 검증 완료

```text
npm run build: 성공
git diff --check: 성공
src/shared 변경: 없음
```

빌드 시 번들 크기 500kB 초과 경고는 기존 번들 최적화 관련 경고이며, 이번 API 연동 실패는 아니다.
