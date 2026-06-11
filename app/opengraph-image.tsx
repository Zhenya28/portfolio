import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Yevhen Kapush — freelance developer, Warszawa";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0d10",
          backgroundImage:
            "linear-gradient(rgba(232,237,242,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,237,242,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          color: "#e8edf2",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#97a1ac" }}>
          <span style={{ color: "#9fef00" }}>$</span>
          <span style={{ marginLeft: 12 }}>./pomysl --na &quot;aplikację, dashboard, bota&quot;</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 800, letterSpacing: "-0.03em" }}>
            Pomysł jest twój.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#97a1ac",
              marginTop: 4,
            }}
          >
            Dowiezienie —<span style={{ color: "#9fef00", marginLeft: 18 }}>moje.</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#5c6670",
          }}
        >
          <span>web · mobile · automatyzacja</span>
          <span>Yevhen Kapush · Warszawa</span>
        </div>
      </div>
    ),
    size,
  );
}
