import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

// Static route — render the share image once at build time.
export const dynamic = "force-static";

export const alt = `${SITE_NAME} — check a UK company's visa sponsor licence`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brutalist black-on-white card mirroring the site's visual language.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          color: "#000000",
          padding: 64,
          border: "16px solid #000000",
          fontFamily: "monospace",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            border: "6px solid #000000",
            padding: "8px 20px",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          UKVI / Live Data
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
              textTransform: "uppercase",
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.35,
              maxWidth: 980,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          Data: gov.uk register of licensed sponsors (workers)
        </div>
      </div>
    ),
    { ...size }
  );
}
