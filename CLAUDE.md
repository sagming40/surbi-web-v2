# surbi-web-v2

Surbi(서울 상권 분석 기반 외식업 창업 지원 서비스) 웹 프론트엔드.
React 19 + TypeScript + Vite + Tailwind 4 + react-query + axios + zustand. 백엔드는 별도 레포 `surbi`(FastAPI + PostgreSQL/PostGIS).

## 백엔드 API 작업 전에

**`src/shared/api/README.md`를 먼저 읽는다.** 사용법(`useBootstrap`), 변환 규칙, 새 API를 붙이는 순서(DTO → 어댑터 → 요청 함수 → 훅), 알려진 데이터 이슈가 정리돼 있다.

핵심만:
- 백엔드 응답은 snake_case다. **`src/shared/api/dto/`와 `adapters/` 밖에서는 snake_case를 쓰지 않는다.**
- DTO는 `surbi/backend/app/schemas/*.py`를 보고 옮긴다. 필드를 추측해서 만들지 않는다.
- 숫자 지표 `{ value, available }`는 `pickMetric`으로 꺼낸다. `available: false`는 0이 아니라 `null`이다.
- 기간은 백엔드 `'20262'` ↔ 프론트 `'2026Q2'`. `toQuarter` / `toPeriodCode`를 쓴다.
- 기능 준비 상태는 `bootstrap.capabilities`로 판단한다. `NOT_READY` 기능을 임의 값으로 채우지 않는다.

## 팀 규칙

- `src/shared/`(ui, types, api, lib)는 팀 공용이다. 수정·추가 전에 팀에 공유하고 **화면 작업과 섞지 않고 별도 커밋**한다.
- 다른 담당자의 화면 폴더(`src/pages/*`, `src/features/*`)는 직접 고치지 않는다.
- `main`에 직접 push하지 않는다. `feature/*` 브랜치에서 PR 후 합의해서 merge한다.
- 커밋은 화면 하나(또는 기능 하나) 단위로 한다.

## 로컬 실행

- `npm run dev` → `http://localhost:5000`
- `/api` 요청은 Vite 프록시로 `localhost:8000`(surbi 백엔드, Docker)에 전달된다. `.env`의 `VITE_API_BASE_URL`은 로컬에서 비워 둔다.
- 타입 검사: `npx tsc -p tsconfig.app.json --noEmit`
