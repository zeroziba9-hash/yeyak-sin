import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const restaurants = [
  { name: "홍대 숯불갈비", category: "한식", address: "서울 마포구 와우산로 21", lat: 37.5525, lng: 126.9231, waiting: 3 },
  { name: "연남 파스타공방", category: "양식", address: "서울 마포구 성미산로 10", lat: 37.5615, lng: 126.9257, waiting: 0 },
  { name: "합정 스시야", category: "일식", address: "서울 마포구 양화로 45", lat: 37.5497, lng: 126.9139, waiting: 5 },
  { name: "강남 곱창집", category: "한식", address: "서울 강남구 테헤란로 123", lat: 37.5006, lng: 127.0364, waiting: 2 },
  { name: "역삼 마라탕관", category: "중식", address: "서울 강남구 역삼로 456", lat: 37.5006, lng: 127.0369, waiting: 0 },
  { name: "삼성동 오마카세", category: "일식", address: "서울 강남구 삼성로 100", lat: 37.5088, lng: 127.0631, waiting: 8 },
  { name: "이태원 타코바", category: "양식", address: "서울 용산구 이태원로 27", lat: 37.5345, lng: 126.9945, waiting: 1 },
  { name: "한남 브런치카페", category: "카페", address: "서울 용산구 한남대로 34", lat: 37.5346, lng: 127.0007, waiting: 0 },
  { name: "성수 베이커리", category: "카페", address: "서울 성동구 성수이로 20", lat: 37.5443, lng: 127.0557, waiting: 4 },
  { name: "성수 곱창로스", category: "한식", address: "서울 성동구 아차산로 17", lat: 37.5447, lng: 127.0559, waiting: 6 },
  { name: "잠실 훠궈타운", category: "중식", address: "서울 송파구 올림픽로 300", lat: 37.5133, lng: 127.1001, waiting: 0 },
  { name: "잠실 라멘공방", category: "일식", address: "서울 송파구 잠실로 200", lat: 37.5139, lng: 127.1006, waiting: 3 },
  { name: "여의도 스테이크하우스", category: "양식", address: "서울 영등포구 여의대로 8", lat: 37.5219, lng: 126.9245, waiting: 2 },
  { name: "종로 냉면집", category: "한식", address: "서울 종로구 종로 50", lat: 37.5704, lng: 126.9910, waiting: 0 },
  { name: "을지로 노포집", category: "한식", address: "서울 중구 을지로 100", lat: 37.5663, lng: 126.9915, waiting: 7 },
  { name: "신촌 감자탕", category: "한식", address: "서울 서대문구 신촌로 15", lat: 37.5559, lng: 126.9368, waiting: 1 },
  { name: "건대 양꼬치거리", category: "중식", address: "서울 광진구 능동로 200", lat: 37.5407, lng: 127.0700, waiting: 5 },
  { name: "압구정 디저트카페", category: "카페", address: "서울 강남구 압구정로 50", lat: 37.5273, lng: 127.0287, waiting: 0 },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.restaurant.deleteMany();

  for (const r of restaurants) {
    await prisma.restaurant.create({ data: r });
  }

  console.log(`Seeded ${restaurants.length} restaurants.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
