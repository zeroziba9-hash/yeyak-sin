"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Restaurant = {
  id: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  waiting: number;
};

declare global {
  interface Window {
    kakao: any;
  }
}

export default function RestaurantMap({
  restaurants,
  kakaoKey,
}: {
  restaurants: Restaurant[];
  kakaoKey: string;
}) {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // next/script only fires onLoad once per page load; if this component
    // remounts (e.g. navigating back) the SDK is already on window.
    if (window.kakao?.maps) setSdkLoaded(true);
  }, []);

  useEffect(() => {
    if (!sdkLoaded || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5445, 127.0), // 서울 중심 근사치
        level: 8,
      });

      restaurants.forEach((r) => {
        const position = new window.kakao.maps.LatLng(r.lat, r.lng);
        const marker = new window.kakao.maps.Marker({ position, map });

        const content = `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">
          <strong>${r.name}</strong><br/>대기 ${r.waiting}팀
        </div>`;
        const infowindow = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1.4,
        });

        window.kakao.maps.event.addListener(marker, "mouseover", () =>
          infowindow.setMap(map)
        );
        window.kakao.maps.event.addListener(marker, "mouseout", () =>
          infowindow.setMap(null)
        );
        window.kakao.maps.event.addListener(marker, "click", () =>
          router.push(`/restaurants/${r.id}`)
        );
      });
    });
  }, [sdkLoaded, restaurants, router]);

  if (!kakaoKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-100 p-6 text-center text-sm text-zinc-500">
        카카오맵 API 키가 설정되지 않았습니다. <br />
        .env.local에 NEXT_PUBLIC_KAKAO_MAP_KEY를 추가해주세요.
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => setSdkLoaded(true)}
      />
      <div ref={mapRef} className="h-full w-full" />
    </>
  );
}
