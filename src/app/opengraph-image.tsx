import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Site Clinic visibility management for small-business websites";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f4ed",
          color: "#1f2937",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 999,
              background: "#3f7d63",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 25,
            }}
          >
            SC
          </div>
          Site Clinic
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.02,
              letterSpacing: 0,
              fontWeight: 700,
              maxWidth: 920,
            }}
          >
            Visibility management for small-business websites.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              lineHeight: 1.35,
              color: "#51606f",
              maxWidth: 900,
            }}
          >
            Monitor technical health, accessibility, SEO, AI retrieval readiness, and proof of improvement.
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#3f7d63", fontWeight: 700 }}>
          <span>Monitor</span>
          <span>•</span>
          <span>Decide</span>
          <span>•</span>
          <span>Improve</span>
          <span>•</span>
          <span>Verify</span>
        </div>
      </div>
    ),
    size,
  );
}
