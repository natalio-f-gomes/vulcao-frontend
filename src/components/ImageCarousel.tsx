import { useState } from "react";

// Base URL of the PUBLIC serving bucket. Swap to your CloudFront domain later —
// keys stay the same, only this prefix changes.
// TODO: replace with CloudFront domain before prod.
export const IMAGE_BASE_URL =
  "https://vulcao-app-images.s3.eu-south-2.amazonaws.com";

export function imageUrlFromKey(key: string): string {
  return `${IMAGE_BASE_URL}/${key}`;
}

interface ImageCarouselProps {
  imageKeys?: string[] | null;
  /** Rendered size of the image area */
  width?: number;
  height?: number;
  altText?: string;
}

function ImageCarousel({
  imageKeys,
  width = 200,
  height = 140,
  altText = "image",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  const keys = imageKeys ?? [];

  // No images — show a neutral placeholder box.
  if (keys.length === 0) {
    return (
      <div
        style={{
          width,
          height,
          borderRadius: 12,
          background: "#f0ece6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bbb",
          fontSize: "1.6rem",
        }}
      >
        <i className="bi bi-image"></i>
      </div>
    );
  }

  const safeIndex = Math.min(index, keys.length - 1);

  const prev = () =>
    setIndex((i) => (i - 1 + keys.length) % keys.length); // wraps around
  const next = () =>
    setIndex((i) => (i + 1) % keys.length);

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 26,
    height: 26,
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    lineHeight: 1,
  };

  return (
    <div style={{ position: "relative", width, height }}>
      <img
        src={imageUrlFromKey(keys[safeIndex])}
        alt={`${altText} ${safeIndex + 1} of ${keys.length}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 12,
          border: "4px solid white",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          display: "block",
        }}
        // If a key points at a deleted/missing object, fall back gracefully.
        onError={(e) => {
          (e.target as HTMLImageElement).style.opacity = "0.25";
        }}
      />

      {/* arrows + dots only when there's something to scroll */}
      {keys.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            style={{ ...arrowStyle, left: 6 }}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            style={{ ...arrowStyle, right: 6 }}
          >
            <i className="bi bi-chevron-right"></i>
          </button>

          {/* dots */}
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 5,
            }}
          >
            {keys.map((_, i) => (
              <span
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  cursor: "pointer",
                  background:
                    i === safeIndex ? "#fff" : "rgba(255,255,255,0.45)",
                  boxShadow: "0 0 2px rgba(0,0,0,0.4)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCarousel;