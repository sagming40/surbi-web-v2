# 리팩토링 대기 목록

기능 동작에는 문제가 없지만 정리가 필요한 것들. 급한 순서가 아니라 영역별로 묶었다.

---

## 공용화

**`formatQuarter` 중복**
`features/map/RankingPanel/index.tsx` 에 사본이 남아 있다. `shared/lib/format.ts` 의 것을 쓰면 된다.

**카카오 SDK 로더 중복**
`features/map/useKakaoMap.ts` 와 `pages/SimulationPage/KakaoMap.tsx` 가 각자 SDK 를 로드한다.
지금은 `<script>` id 를 `kakao-map-sdk` 로 맞춰서 중복 삽입만 막아둔 상태다.
`shared/lib/kakao.ts` 로 빼는 게 맞지만 성환님 파일을 수정해야 해서 합의가 필요하다.

> 저쪽 로더는 `<script>` 가 **이미 로드 완료된 뒤** 컴포넌트가 마운트되면 `load` 이벤트를
> 못 받아 `loading` 상태에 갇힌다. 공용화할 때 같이 해결된다.

---

## 컴포넌트

**`SegmentToggle` 이 uncontrolled**
`shared/ui/SegmentToggle` 이 내부 `useState` 로 선택 상태를 들고 있다.
`RankingPanel` 의 지표 토글이 이걸 쓰는데, "필터 초기화" 같은 기능을 붙이면
상태를 되돌려도 토글 겉모습이 안 따라온다. `value` prop 을 받도록 고쳐야 한다.

> 정렬 토글은 같은 이유로 이미 직접 그리는 방식으로 바꿨다.

**`RankTable` 헤더가 스크롤에 딸려 올라간다**
`RankingPanel` 에서 표만 스크롤시키는데 헤더 행도 같이 올라간다.
`shared/ui/RankTable` 을 고치면 다른 화면에도 영향이 가므로 별도 판단이 필요하다.

---

## 임시 데이터 · 임시 타입

정식 타입/데이터가 확정되면 지우면 되는 것들. 지금은 화면을 먼저 만들려고 확장해 둔 상태다.

| 위치 | 내용 |
|---|---|
| `pages/DashboardPage/mock.ts` | `DashboardMockExtra` — KPI·점포당매출 증감률, 직전분기 업종 계열 |
| `features/building/BuildingDetailPanel/types.ts` | 매장 주소·개업일·폐업일 |
| `features/map/mock/seoulDistrictsGeo.ts` | `DistrictGeoMock` — `DistrictGeo` 에 `center` 가 없어 붙임 |
| `features/map/mock/seoulMapMock.ts` | 자치구 랭킹 수치 (목업 TOP10 + 임의값) |
| `features/map/mock/seoulDongMock.ts` | 행정동 랭킹 수치 (코드 해시로 생성) |
| `features/map/mock/*Geo.ts` | 실제 경계. BE 가 `/api/geo/...` 로 주면 삭제 |
| `features/map/TrdarQuickPreview/index.tsx` | `TYPE_BADGE_VARIANT` 의 A/B/C/D — 상권 구분 코드 미확정 |
| `pages/DashboardPage/mock.ts` | 업종 대분류 `CS1`~`CS6` — 실제 체계 아님 |

---

## 별도 커밋으로 빼야 하는 것

**`src/index.css` 의 `--font-size-*` → `--text-*`**

Tailwind 4 는 폰트 크기를 `--text-*` 네임스페이스로 읽는다. `--font-size-*` 로 정의돼 있어서
토큰 6종이 전부 무시되고 모든 글자가 브라우저 기본 16px 로 나오고 있었다.

**팀 전체 화면에 영향이 가므로 별도 커밋 + 공지가 필요하다.**

---

## 미구현 · 연결 대기

- `MapSideMenu` 의 세 도구(업종 필터 / 상권영역 / 범위 그리기) — 버튼과 on/off 상태만 있고 동작 없음
- `RankingPanel` 의 `onRowClick` 에서 행정동 클릭 시 지도 동작 — 현재 선택만 됨
- 08 건물 상세 — 닫기(✕) 버튼, 폐업 매장 정책, 매장 행 `→` 화살표
- 위저드 수신부 (`step`/`guCode` 쿼리 파라미터) — 성환님 담당

---

## 확인 요청 대기 (DB · BE)

| # | 내용 | 화면 |
|---|---|---|
| 1 | KPI 4종 전분기 대비 증감률 | 03 |
| 2 | 점포당 평균 매출액 증감률 | 03 |
| 3 | 업종 대분류 차트의 직전분기 계열 | 03 |
| 4 | `salesTrend` 필드명 재검토 (값은 점포당 평균) | 03 |
| 5 | 대시보드에 자치구 필터가 필요한지 | 03 |
| 6 | 매장별 주소 · 개업일 · 폐업일 | 08 |
| 7 | 업종 대분류 코드 체계 확정 | 03 · 08 · 01 |
| 8 | 폐업 매장을 목록에 포함할지 | 08 |
| 9 | `DistrictGeo` 에 `center` 추가 (라벨 오버레이 위치용) | 01 |
| 10 | 상권 구분 코드 체계 확정 (`trdarTypeCode`) | 01 |
| 11 | 행정동 코드 자릿수 — 영역 데이터는 8자리(`11110515`), `DongCode` 주석은 10자리 | 01 · 08 |
