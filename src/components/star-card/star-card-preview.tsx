import { useEffect, useRef, useState } from "react";

import { STAR_CARD_HEIGHT, STAR_CARD_WIDTH } from "../../lib/star-card";

import type { StarCardDesign, StarCardElement } from "../../types/star-card";

type StarCardPreviewProps = {
  design: StarCardDesign;
  maxWidth?: number;
};

const backgroundThemes = {
  paper: { base: "#fffdf9", accent: "#dcecf9" },
  sky: { base: "#f2f8ff", accent: "#b9dcfb" },
  blush: { base: "#fffaf7", accent: "#f1dfe7" },
} as const;

function getBubbleSize(element: Extract<StarCardElement, { kind: "text" }>) {
  const bubblePaddingX = 18;
  const bubblePaddingY = 14;
  const textLength = Math.max(1, element.text.trim().length);
  const bubbleWidth = Math.min(
    220,
    Math.max(92, textLength * (element.fontSize * 0.56) + bubblePaddingX * 2),
  );
  const maxCharsPerLine = Math.max(
    8,
    Math.floor((bubbleWidth - bubblePaddingX * 2) / (element.fontSize * 0.56)),
  );
  const lineCount = Math.max(1, Math.ceil(textLength / maxCharsPerLine));
  const bubbleHeight = Math.max(
    54,
    lineCount * (element.fontSize + 3) + bubblePaddingY * 2,
  );

  return { bubbleHeight, bubblePaddingX, bubbleWidth };
}

function BackgroundDecor({ design }: { design: StarCardDesign }) {
  if (design.background === "sky") {
    return (
      <>
        <div className="absolute top-[18px] left-[284px] h-[120px] w-[180px] rounded-[160px] bg-[#d8ebfd] opacity-80" />
        <div className="absolute top-[38px] left-[32px] h-[72px] w-[110px] rounded-[160px] bg-[#eff7fe] opacity-95" />
      </>
    );
  }

  if (design.background === "blush") {
    return (
      <>
        <div className="absolute top-[246px] left-[-18px] h-[120px] w-[180px] rounded-[160px] bg-[#f6e8ee] opacity-90" />
        <div className="absolute top-[32px] left-[396px] h-[72px] w-[110px] rounded-[160px] bg-[#fff2ef] opacity-85" />
      </>
    );
  }

  return (
    <>
      <div className="absolute top-[24px] left-[354px] h-[96px] w-[156px] rounded-[160px] bg-[#e8f4fe] opacity-95" />
      <div className="absolute top-[238px] left-[-24px] h-[120px] w-[184px] rounded-[160px] bg-[#f9f2eb] opacity-85" />
    </>
  );
}

export function StarCardPreview({
  design,
  maxWidth = STAR_CARD_WIDTH,
}: StarCardPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(maxWidth);
  const theme = backgroundThemes[design.background];
  const scale = Math.min(width, maxWidth) / STAR_CARD_WIDTH;
  const height = STAR_CARD_HEIGHT * scale;

  useEffect(() => {
    const node = containerRef.current;

    if (!node) {
      return;
    }

    const update = () => {
      setWidth(Math.min(node.clientWidth, maxWidth));
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, [maxWidth]);

  return (
    <div className="w-full" ref={containerRef}>
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-[#dfeaf2] shadow-[0_24px_80px_rgba(164,184,204,0.16)]"
        style={{
          backgroundColor: theme.base,
          height,
          width,
        }}
      >
        <BackgroundDecor design={design} />
        <div
          className="absolute rounded-[24px]"
          style={{
            backgroundColor: theme.accent,
            height: 12 * scale,
            left: 232 * scale,
            opacity: 0.5,
            top: 24 * scale,
            width: 96 * scale,
          }}
        />

        {design.elements.map((element) => {
          if (element.kind === "text") {
            const { bubbleHeight, bubblePaddingX, bubbleWidth } = getBubbleSize(element);

            return (
              <div
                className="absolute"
                key={element.id}
                style={{
                  left: element.x * scale,
                  top: element.y * scale,
                  transform: `rotate(${element.rotation}deg)`,
                  transformOrigin: "top left",
                }}
              >
                <div
                  className="relative rounded-[20px] border border-[#edf2f7] bg-[rgba(255,255,255,0.92)] shadow-[0_10px_24px_rgba(185,220,251,0.28)]"
                  style={{
                    minHeight: bubbleHeight * scale,
                    padding: `${14 * scale}px ${bubblePaddingX * scale}px`,
                    width: bubbleWidth * scale,
                  }}
                >
                  <div
                    className="absolute bottom-[-7px] left-[20px] h-[16px] w-[16px] rotate-[-14deg] rounded-[10px] bg-[rgba(255,255,255,0.92)]"
                    style={{
                      height: 16 * scale,
                      width: 16 * scale,
                    }}
                  />
                  <p
                    className="m-0 whitespace-pre-wrap"
                    style={{
                      color: element.color,
                      fontFamily: "Georgia, serif",
                      fontSize: element.fontSize * scale,
                      lineHeight: 1.25,
                    }}
                  >
                    {element.text}
                  </p>
                </div>
              </div>
            );
          }

          if (element.kind === "emoji") {
            return (
              <span
                className="absolute block select-none"
                key={element.id}
                style={{
                  fontSize: element.fontSize * scale,
                  left: element.x * scale,
                  top: element.y * scale,
                  transform: `rotate(${element.rotation}deg)`,
                  transformOrigin: "center",
                }}
              >
                {element.emoji}
              </span>
            );
          }

          return (
            <img
              alt=""
              className="absolute rounded-[1.25rem] object-cover shadow-[0_14px_26px_rgba(185,220,251,0.25)]"
              key={element.id}
              src={element.src}
              style={{
                height: element.height * scale,
                left: element.x * scale,
                top: element.y * scale,
                transform: `rotate(${element.rotation}deg)`,
                transformOrigin: "top left",
                width: element.width * scale,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
