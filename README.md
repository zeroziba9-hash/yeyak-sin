# 예약의 신 🍽️

내 주변 음식점의 실시간 웨이팅 현황을 지도에서 확인하는 서비스입니다.

학원의신(팔랑크스 시스템즈)의 핵심 패턴 — **위치 기반 검색 + 리뷰 + 실시간 정보** — 을 음식점 도메인으로 압축 구현한 토이 프로젝트입니다.

## 주요 기능

- 🗺️ **지도 기반 검색**: 카카오맵 위에 서울 지역 음식점 마커 표시, 클릭 시 상세 이동
- 🏷️ **카테고리 필터**: 한식/양식/일식/중식/카페별로 리스트·지도 동시 필터링
- ⭐ **리뷰**: 닉네임/별점/내용으로 리뷰 작성, 등록 즉시 평균 평점 반영
- ⏱️ **실시간 웨이팅**: 3초 폴링으로 대기 인원수 갱신, 관리자용 +/- 버튼 제공
- 💬 **실시간 채팅 상담**: Server-Sent Events(SSE) 기반 실시간 메시지 푸시, 고객/사장님 역할 전환 가능

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

- **실시간 웨이팅은 폴링, 채팅 상담은 SSE로 다르게 구현한 이유**: 웨이팅은 단방향 상태 값(대기 인원수) 조회만 필요해서 3초 폴링으로 충분합니다. 반면 채팅 상담은 상대방이 메시지를 보낸 순간 바로 반영돼야 해서, 서버가 클라이언트로 실시간 푸시할 수 있는 SSE(Server-Sent Events)를 썼습니다. 클라이언트→서버는 기존처럼 REST POST로 저장하고, 서버→클라이언트 알림만 SSE로 브로드캐스트하는 구조입니다.
- **SSE vs WebSocket**: 이 채팅은 서버→클라이언트 단방향 푸시만 필요해서 SSE로 충분했습니다. 클라이언트가 서버로도 실시간 이벤트를 보내야 하는 양방향 상호작용(예: 타이핑 중 표시)이 필요하다면 WebSocket이 더 적합합니다.
- **13만 개 규모로 확장한다면**: 지금은 SQLite로 소량 데이터만 다루지만, 실제 서비스 규모에서는 위경도 계산이나 텍스트 검색 성능을 위해 PostGIS나 Elasticsearch 도입이 필요합니다. 채팅도 서버가 여러 대로 늘어나면 인메모리 pub-sub만으로는 부족해서 Redis Pub/Sub 같은 공유 브로커가 필요합니다.
