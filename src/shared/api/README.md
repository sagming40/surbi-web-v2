# shared/api — 백엔드(surbi) 연결 레이어

surbi 백엔드(FastAPI)의 응답을 받아 **프론트 모양으로 바꿔서** 화면에 넘겨주는 공용 영역이다.
화면 코드는 백엔드 응답 모양(snake_case)을 몰라도 되게 만드는 것이 목표다.

> 사람과 AI 모두 이 문서를 먼저 읽고 작업한다. 규칙을 바꾸면 이 문서도 같이 고친다.

---

## 바로 쓰기

### bootstrap (앱 기준값) — 기간·업종·상권 유형·지표·기능 준비 상태

```tsx
import { useBootstrap } from '@/shared/api/useBootstrap';

const { data: bootstrap, isLoading, isError } = useBootstrap();

bootstrap?.latestQuarter        // '2026Q2'  최신 분기
bootstrap?.previousQuarter      // '2026Q1'
bootstrap?.availableQuarters    // ['2026Q2', '2026Q1', ... ] 22개, 최신순
bootstrap?.categoryGroups       // [{ groupCode: 'CS1', groupName: '외식업', items: [10개] }]
bootstrap?.commercialAreaTypes  // ['골목상권', '발달상권', '전통시장', '관광특구']
bootstrap?.rankingMetrics       // ['sales', 'storeCount', 'flowPopulation', 'residentPopulation']
bootstrap?.capabilities         // { buildingDetail, startupAnalysis, mlAnalysis, favorites, auth }
```

- 앱 실행 중 **한 번만** 요청한다(`staleTime: Infinity`). 여러 화면에서 불러도 요청은 1번이다.
- 첫 렌더링에서는 `data`가 `undefined`다. 반드시 `bootstrap?.` 처럼 `?.`로 접근한다.
- `useState(bootstrap.latestQuarter)`처럼 **초기값으로 넣지 말 것.** 초기값은 첫 렌더링에서 한 번만 읽혀서, 나중에 도착한 값이 반영되지 않는다.
  "사용자가 고른 값 ?? bootstrap 값 ?? 임시값" 순서로 계산한다.

```tsx
const [picked, setPicked] = useState<Quarter | null>(null);
const quarters = bootstrap?.availableQuarters ?? [];
const quarter  = picked ?? bootstrap?.latestQuarter ?? null;
// 드롭다운: options = quarters, value = quarter, onChange = setPicked
```

### capabilities — 백엔드가 알려주는 기능 준비 상태

값은 `'READY' | 'PARTIAL' | 'NOT_READY'`. **`NOT_READY`인 기능은 화면에서 임의 값으로 채우지 말고** `EmptyState` 등으로 "준비 중"을 표시한다.
2026-09 기준: `auth`·`favorites`·`buildingDetail`·`mlAnalysis` = `NOT_READY`, `startupAnalysis` = `PARTIAL`.

---

## 폴더 구조

```
shared/api/
  client.ts          axios 인스턴스. baseURL = {VITE_API_BASE_URL}/api/v1
  queryClient.ts     react-query 기본 설정 (main.tsx에서 Provider로 등록됨)
  convert.ts         공용 변환 함수
  dto/               백엔드 응답 원본 타입 (snake_case, surbi/backend/app/schemas 를 그대로 옮김)
  adapters/          DTO → 프론트 타입(shared/types) 변환
  bootstrap.ts       getBootstrap() = 요청 + 변환
  useBootstrap.ts    화면에서 쓰는 훅
  startupAnalysis.ts POST 창업 분석 요청 + 변환
  useStartupAnalysis.ts 버튼 클릭 시 쓰는 mutation 훅
```

데이터 흐름:

```
백엔드 JSON (snake_case)
  → apiClient.get<XxxDto>()          dto/        백엔드 모양 그대로
  → toXxx(dto)                       adapters/   이름·모양·형식 변환
  → Xxx (shared/types, camelCase)    화면이 쓰는 모양
  → useXxx()                         react-query 캐시
```

**snake_case는 `dto/`와 `adapters/` 밖으로 나가면 안 된다.** 화면 코드에 `latest_period` 같은 이름이 보이면 잘못된 것이다.

### startup analysis (위저드 결과 생성)

```tsx
import { useStartupAnalysis } from '@/shared/api/useStartupAnalysis';

const { mutateAsync: createStartupAnalysis, isPending } = useStartupAnalysis();
const result = await createStartupAnalysis(request);
```

- `POST /startup-analysis`는 사용자의 선택으로 새 분석을 생성하므로 조회 캐시가 아닌 `useMutation`으로 관리한다.
- 화면은 `StartupAnalysisRequest`·`StartupAnalysisResponse`의 camelCase만 사용한다.
- 백엔드의 snake_case 요청·응답은 `dto/startupAnalysis.ts`, `adapters/startupAnalysis.ts` 안에서만 처리한다.

---

## 변환 규칙 (convert.ts)

| 함수 | 입력 → 출력 | 주의 |
|---|---|---|
| `pickMetric(m)` | `{ value, available }` → `number \| null` | `available: false`면 값이 있어도 **null**. 0과 "데이터 없음"은 다르다 |
| `toQuarter(code)` | `'20262'` → `'2026Q2'` | 백엔드 기간 코드는 5자리(연도4+분기1) |
| `toPeriodCode(q)` | `'2026Q2'` → `'20262'` | 요청 파라미터 `?period=` 에 넣을 때 |
| `toMetricKey(code)` | `'floating_population'` → `'flowPopulation'` | 지표 이름이 다른 건 유동인구 하나 |

백엔드는 **값이 없으면 `null`, 실제로 0이면 `0`**을 보낸다. `null`을 0으로 바꿔 그리면 "신규 점포 0개" 같은 잘못된 화면이 나온다. `null`은 `—` 또는 EmptyState로 그린다.

---

## 새 API를 붙이는 순서

`/api/v1/dashboard`를 예로 든다. bootstrap이 이 순서로 만들어져 있으니 그대로 따라 하면 된다.

1. **DTO** — `dto/dashboard.ts`
   `surbi/backend/app/schemas/dashboard.py`를 보고 **필드명 그대로(snake_case)** 옮긴다. 추측으로 쓰지 않는다.
   - `str`→`string`, `int`/`float`→`number`, `bool`→`boolean`, `datetime`→`string`
   - `list[X]`→`X[]`, `dict[str, int]`→`Record<string, number>`
   - `X | None`→`X | null` (`?` 선택 속성이 아니다. 백엔드는 키를 빼지 않고 `null`을 보낸다)
   - `Literal["A","B"]`→`'A' | 'B'`, `Field(...)`·`model_config`는 버린다
   - 공통 타입(`AreaRefDto`, `NumericMetricDto`, `PeriodRefDto` 등)은 `dto/common.ts`에서 가져온다
2. **프론트 타입** — 이미 `shared/types`에 있으면 재사용, 없으면 추가 (`shared/types/index.ts`에 export 한 줄)
3. **어댑터** — `adapters/dashboard.ts`에 `export function toDashboard(dto): Dashboard`
   - null 가능 → 삼항(`? :`), 배열 → `map`, 숫자 지표 → `pickMetric`, 기간 → `toQuarter`
   - 화면에 안 쓰는 필드는 옮기지 않는다
4. **요청 함수** — `dashboard.ts`에 `export async function getDashboard(quarter)`
   `apiClient.get<DashboardDto>('/dashboard', { params: { period: toPeriodCode(quarter) } })` → 어댑터
5. **훅** — `useDashboard.ts`
   `queryKey`에 **요청 파라미터를 전부** 넣는다: `['dashboard', quarter]`. 빠뜨리면 분기를 바꿔도 캐시가 갈리지 않는다

확인: `npx tsc -p tsconfig.app.json --noEmit` 오류 0개 + 브라우저 콘솔에서 변환 결과 확인.

---

## 로컬에서 실제 백엔드로 확인하기

1. surbi 레포 README대로 Docker로 DB·백엔드 실행 (DB dump 복원 필요)
   `curl http://localhost:8000/health` → `{"status":"ok"}`
2. 이 레포에서 `npm run dev` (포트 5000)
3. `vite.config.ts`의 프록시가 `/api` 요청을 `localhost:8000`으로 넘긴다. `.env`의 `VITE_API_BASE_URL`은 **비워 둔다**
4. 백엔드 Swagger: `http://localhost:8000/docs`

- 브라우저에서 **502 Bad Gateway** → 백엔드가 꺼져 있음 (`docker ps`로 확인)
- 프록시는 **개발 서버 전용**이다. 배포 시 CORS/리버스 프록시 구성은 별도로 정해야 한다

---

## 알려진 이슈 (2026-09 기준)

- **구·동 이름이 코드로 나온다 (C-009).** `/api/v1/areas` 등에서 `name`이 `code`와 같다(`"11110515"`). 백엔드 재적재 대기 중. 화면이 깨진 게 아니라 데이터 상태다.
- **행정동 코드는 8자리**(`'11110515'`). `shared/types/common.ts`의 `DongCode` 주석 예시(10자리)는 틀렸다.
- **업종은 외식업(CS1, 10개)만 쓴다.** 백엔드는 100개를 주지만 어댑터에서 CS1만 남긴다. 범위를 넓히려면 `adapters/bootstrap.ts`의 `CATEGORY_GROUPS`에 줄을 추가한다.
  업종 코드 앞 3자리가 대분류다: `CS1` 외식업 · `CS2` 서비스업 · `CS3` 소매업.
- 업종 이름 구분자가 mock과 다르다: 백엔드 `호프-간이주점`, `커피-음료` / 기존 mock `호프·간이주점`, `커피·음료`.
- 상권 유형은 **이름만** 온다(`'골목상권'`). 코드("A" 등)는 없다.
- `/health`는 `/api` 아래가 아니라 프록시를 타지 않는다. 연결 확인은 `/api/v1/bootstrap`으로 한다.

---

## 백엔드 엔드포인트 (surbi, 2026-09 openapi 기준)

```
GET   /api/v1/bootstrap
GET   /api/v1/areas                       ?unit &parent_code &format=legacy|selection
GET   /api/v1/map/areas                   ?unit &parent_code &gu_code     (GeoJSON, WGS84)
GET   /api/v1/commercial-areas            ?gu_code &dong_code &type &search
GET   /api/v1/explore/overview            ?level &period &parent_code &industry_code &commercial_area_type
GET   /api/v1/areas/{unit}/{code}/report  ?period &industry_code &sections
GET   /api/v1/dashboard                   ?period
GET   /api/v1/buildings/{building_id}     ?include_inactive &business_limit &business_offset
POST  /api/v1/spatial/overlap
POST  /api/v1/startup-analysis
POST  /api/v1/analysis-reports
```

`unit`/`level` 값: `SEOUL` · `GU` · `DONG` · `COMMERCIAL_AREA` · `COMMERCIAL_HINTERLAND`
`/explore`(구버전), `/areas/{area_id}`, `/commercial-areas/{trdar_cd}`는 deprecated이고 좌표가 EPSG:5181이라 카카오맵에 쓰지 않는다.
정확한 필드는 `http://localhost:8000/docs` 또는 `surbi/backend/app/schemas/`를 본다.
