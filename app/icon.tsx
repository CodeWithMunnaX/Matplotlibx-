import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "8px",
          border: "1.5px solid #00D9C0",
          boxShadow: "0 0 10px rgba(0, 217, 192, 0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
          }}
        >
          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "2px", background: "#6366F1" }} />
            <div style={{ width: "7px", height: "7px", borderRadius: "2px", background: "#00D9C0" }} />
          </div>
          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "2px", background: "#FFB86B" }} />
            <div style={{ width: "7px", height: "7px", borderRadius: "2px", background: "#FF5C7A" }} />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
