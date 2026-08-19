import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1021 0%, #16203B 100%)",
          borderRadius: "36px",
          border: "4px solid #00D9C0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#6366F1" }} />
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#00D9C0" }} />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FFB86B" }} />
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#FF5C7A" }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
