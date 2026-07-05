# 예약의 신 🍽️

내 주변 음식점의 실시간 웨이팅 현황을 지도에서 확인하는 서비스입니다.

학원의신(팔랑크스 시스템즈)의 핵심 패턴 — **위치 기반 검색 + 리뷰 + 실시간 정보** — 을 음식점 도메인으로 압축 구현한 토이 프로젝트입니다.

## 주요 기능

- 🗺️ **지도 기반 검색**: 카카오맵 위에 서울 지역 음식점 마커 표시, 클릭 시 상세 이동
- 🏷️ **카테고리 필터**: 한식/양식/일식/중식/카페별로 리스트·지도 동시 필터링
- ⭐ **리뷰**: 닉네임/별점/내용으로 리뷰 작성, 등록 즉시 평균 평점 반영
- ⏱️ **실시간 웨이팅**: 3초 폴링으로 대기 인원수 갱신, 관리자용 +/- 버튼 제공

## 기술 스택

| 영역 | 스택 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| DB / ORM | SQLite + Prisma |
| 지도 | 카카오맵 JavaScript SDK |
| 스타일 | Tailwind CSS |

## 실행 방법

```bash
npm install

# .env 파일 생성
echo 'DATABASE_URL="file:./dev.db"' > .env

# .env.local 파일 생성 (카카오맵 JavaScript 키 필요 - https://developers.kakao.com)
echo 'NEXT_PUBLIC_KAKAO_MAP_KEY=발급받은키' > .env.local

npx prisma generate
npx prisma migrate dev
npx tsx prisma/seed.ts

npm run dev
```

`http://localhost:3000` 접속.

## 설계 메모

- **실시간 웨이팅을 웹소켓이 아닌 폴링으로 구현한 이유**: 양방향 채팅이 아니라 단방향 상태 값(대기 인원수) 조회만 필요해서, 폴링으로도 충분하다고 판단했습니다. 사용자가 늘어나면 웹소켓/SSE 전환을 고려해야 합니다.
- **13만 개 규모로 확장한다면**: 지금은 SQLite로 소량 데이터만 다루지만, 실제 서비스 규모에서는 위경도 계산이나 텍스트 검색 성능을 위해 PostGIS나 Elasticsearch 도입이 필요합니다.
