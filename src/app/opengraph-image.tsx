import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BuildwithAiGiri — 25 MVPs in 25 Weeks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Background circles */}
        <div
          style={{
            position: "absolute",
            top: "100px",
            left: "200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(6, 182, 212, 0.08)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            right: "200px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.08)",
            filter: "blur(80px)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "9999px",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            background: "rgba(6, 182, 212, 0.1)",
            padding: "8px 20px",
            marginBottom: "32px",
          }}
        >
          <span style={{ fontSize: "18px", color: "#06b6d4" }}>
            The Movement Has Begun
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#fafafa",
              lineHeight: 1.1,
            }}
          >
            25 MVPs. 25 Weeks.
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              background: "linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
            }}
          >
            Completely Free.
          </span>
        </div>

        {/* Subtitle */}
        <span
          style={{
            fontSize: "24px",
            color: "#9ca3af",
            marginTop: "24px",
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Submit your idea. Get a free MVP built in one week.
        </span>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{ fontSize: "20px", fontWeight: 700, color: "#fafafa" }}
          >
            Build
            <span style={{ color: "#06b6d4" }}>withAi</span>
            Giri
          </span>
          <span style={{ fontSize: "20px", color: "#4b5563" }}>|</span>
          <span style={{ fontSize: "18px", color: "#6b7280" }}>
            by Girish Hiremath
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
