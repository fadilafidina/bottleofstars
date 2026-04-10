import { useEffect, useMemo, useState, type ChangeEvent, type RefObject } from "react";
import { Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";
import type Konva from "konva";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { createDefaultCardDesign } from "../../lib/star-card";
import { cn } from "../../lib/utils";

import type {
  StarCardBackground,
  StarCardDesign,
  StarCardElement,
  StarCardImageElement,
} from "../../types/star-card";

const cardWidth = 380;
const cardHeight = 500;

const backgrounds: Array<{
  id: StarCardBackground;
  label: string;
  base: string;
  accent: string;
}> = [
  { id: "paper", label: "Paper", base: "#fffdf9", accent: "#dcecf9" },
  { id: "sky", label: "Sky", base: "#f2f8ff", accent: "#b9dcfb" },
  { id: "blush", label: "Blush", base: "#fffaf7", accent: "#f1dfe7" },
];

const emojiLibrary = ["✦", "☁️", "🩵", "🐚", "🌊", "🫧"];

function useImage(src?: string) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!src) {
      setImage(null);
      return;
    }

    const nextImage = new window.Image();
    nextImage.crossOrigin = "anonymous";
    nextImage.src = src;
    nextImage.onload = () => setImage(nextImage);
  }, [src]);

  return image;
}

function CanvasImageNode({
  element,
  isSelected,
  onSelect,
  onChange,
}: {
  element: StarCardImageElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (next: StarCardImageElement) => void;
}) {
  const image = useImage(element.src);

  if (!image) {
    return null;
  }

  return (
    <KonvaImage
      cornerRadius={22}
      draggable
      height={element.height}
      image={image}
      onClick={onSelect}
      onDragEnd={(event) => {
        onChange({
          ...element,
          x: event.target.x(),
          y: event.target.y(),
        });
      }}
      rotation={element.rotation}
      shadowBlur={isSelected ? 20 : 0}
      shadowColor="#98c9f3"
      stroke={isSelected ? "#98c9f3" : undefined}
      strokeWidth={isSelected ? 2 : 0}
      width={element.width}
      x={element.x}
      y={element.y}
    />
  );
}

function extractSelectedLabel(element: StarCardElement | null) {
  if (!element) {
    return "";
  }

  if (element.kind === "text") {
    return element.text;
  }

  if (element.kind === "emoji") {
    return element.emoji;
  }

  return "Photo";
}

type StarCardEditorProps = {
  design: StarCardDesign;
  onChange: (next: StarCardDesign) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUploadPhoto: (file: File) => Promise<void>;
  stageRef: RefObject<Konva.Stage | null>;
};

export function StarCardEditor({
  design,
  onChange,
  selectedId,
  onSelect,
  onUploadPhoto,
  stageRef,
}: StarCardEditorProps) {
  const selectedElement =
    design.elements.find((element) => element.id === selectedId) ?? null;
  const background = backgrounds.find((entry) => entry.id === design.background) ?? backgrounds[0];
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const updateElement = (id: string, updater: (element: StarCardElement) => StarCardElement) => {
    onChange({
      ...design,
      elements: design.elements.map((element) =>
        element.id === id ? updater(element) : element,
      ),
    });
  };

  const removeSelected = () => {
    if (!selectedId) {
      return;
    }

    onChange({
      ...design,
      elements: design.elements.filter((element) => element.id !== selectedId),
    });
    onSelect(null);
  };

  const addText = () => {
    const id = crypto.randomUUID();
    onChange({
      ...design,
      elements: [
        ...design.elements,
        {
          id,
          kind: "text",
          text: "Write me",
          x: 44,
          y: 178,
          fontSize: 24,
          color: "#344255",
          rotation: 0,
        },
      ],
    });
    onSelect(id);
  };

  const addEmoji = (emoji: string) => {
    const id = crypto.randomUUID();
    onChange({
      ...design,
      elements: [
        ...design.elements,
        {
          id,
          kind: "emoji",
          emoji,
          x: 64 + Math.random() * 180,
          y: 84 + Math.random() * 180,
          fontSize: 34,
          rotation: -10 + Math.random() * 20,
        },
      ],
    });
    onSelect(id);
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingPhoto(true);

    try {
      await onUploadPhoto(file);
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const backgroundDecor = useMemo(() => {
    if (design.background === "sky") {
      return (
        <>
          <Rect cornerRadius={160} fill="#d8ebfd" height={120} opacity={0.8} width={180} x={140} y={28} />
          <Rect cornerRadius={160} fill="#eff7fe" height={72} opacity={0.95} width={110} x={24} y={44} />
        </>
      );
    }

    if (design.background === "blush") {
      return (
        <>
          <Rect cornerRadius={160} fill="#f6e8ee" height={120} opacity={0.9} width={180} x={-18} y={286} />
          <Rect cornerRadius={160} fill="#fff2ef" height={72} opacity={0.85} width={110} x={218} y={32} />
        </>
      );
    }

    return (
      <>
        <Rect cornerRadius={160} fill="#e8f4fe" height={96} opacity={0.95} width={156} x={146} y={24} />
        <Rect cornerRadius={160} fill="#f9f2eb" height={120} opacity={0.84} width={184} x={-24} y={278} />
      </>
    );
  }, [design.background]);

  return (
    <div className="space-y-5">
      <div className="mx-auto w-full max-w-[20rem] overflow-hidden rounded-[2rem] border border-[#dfeaf2] bg-white shadow-[0_24px_80px_rgba(164,184,204,0.16)]">
        <Stage
          height={cardHeight}
          onMouseDown={(event) => {
            const clickedOnStage = event.target === event.target.getStage();
            if (clickedOnStage) {
              onSelect(null);
            }
          }}
          ref={stageRef}
          width={cardWidth}
        >
          <Layer>
            <Rect
              cornerRadius={28}
              fill={background.base}
              height={cardHeight}
              shadowBlur={20}
              shadowColor="#dce9f4"
              shadowOpacity={0.5}
              width={cardWidth}
            />
            {backgroundDecor}
            <Rect
              cornerRadius={24}
              fill={background.accent}
              height={12}
              opacity={0.5}
              width={96}
              x={112}
              y={28}
            />

            {design.elements.map((element) => {
              if (element.kind === "text") {
                return (
                  <Text
                    draggable
                    fill={element.color}
                    fontFamily="Georgia"
                    fontSize={element.fontSize}
                    key={element.id}
                    onClick={() => onSelect(element.id)}
                    onDragEnd={(event) => {
                      updateElement(element.id, () => ({
                        ...element,
                        x: event.target.x(),
                        y: event.target.y(),
                      }));
                    }}
                    rotation={element.rotation}
                    shadowBlur={selectedId === element.id ? 14 : 0}
                    shadowColor="#98c9f3"
                    stroke={selectedId === element.id ? "#98c9f3" : undefined}
                    strokeWidth={selectedId === element.id ? 0.6 : 0}
                    text={element.text}
                    width={228}
                    wrap="word"
                    x={element.x}
                    y={element.y}
                  />
                );
              }

              if (element.kind === "emoji") {
                return (
                  <Text
                    draggable
                    fontSize={element.fontSize}
                    key={element.id}
                    onClick={() => onSelect(element.id)}
                    onDragEnd={(event) => {
                      updateElement(element.id, () => ({
                        ...element,
                        x: event.target.x(),
                        y: event.target.y(),
                      }));
                    }}
                    rotation={element.rotation}
                    shadowBlur={selectedId === element.id ? 18 : 0}
                    shadowColor="#98c9f3"
                    text={element.emoji}
                    x={element.x}
                    y={element.y}
                  />
                );
              }

              return (
                <CanvasImageNode
                  element={element}
                  isSelected={selectedId === element.id}
                  key={element.id}
                  onChange={(next) => {
                    updateElement(element.id, () => next);
                  }}
                  onSelect={() => onSelect(element.id)}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      <Card className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          {backgrounds.map((entry) => (
            <button
              className={cn(
                "rounded-full border px-3 py-2 text-sm transition",
                design.background === entry.id
                  ? "border-[var(--color-sky)] bg-[#edf7ff] text-[var(--color-ink)]"
                  : "border-[#dfeaf2] bg-white/80 text-[var(--color-night)]",
              )}
              key={entry.id}
              onClick={() => onChange({ ...design, background: entry.id })}
              type="button"
            >
              {entry.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={addText} type="button">
            Add text
          </Button>
          {emojiLibrary.map((emoji) => (
            <button
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfeaf2] bg-white/86 text-xl transition hover:bg-[#edf7ff]"
              key={emoji}
              onClick={() => addEmoji(emoji)}
              type="button"
            >
              {emoji}
            </button>
          ))}
          <label className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-[#dfeaf2] bg-white/86 px-4 text-sm text-[var(--color-ink)] transition hover:bg-[#edf7ff]">
            {isUploadingPhoto ? "Adding..." : "Add photo"}
            <input accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleUpload} type="file" />
          </label>
        </div>

        <div className="rounded-[1.5rem] border border-[#e3edf5] bg-white/76 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-night)]/75">
            Selected
          </p>
          {selectedElement ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm text-[var(--color-night)]">
                {selectedElement.kind === "image"
                  ? "Move the photo directly on the card."
                  : "Tap the text below to rewrite it, then drag it into place."}
              </p>
              {selectedElement.kind !== "image" ? (
                <input
                  className="h-11 w-full rounded-2xl border border-[#dae7f3] bg-white/86 px-4 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0]"
                  onChange={(event) => {
                    updateElement(selectedElement.id, (element) =>
                      element.kind === "text"
                        ? { ...element, text: event.target.value }
                        : element.kind === "emoji"
                          ? {
                              ...element,
                              emoji: event.target.value.slice(0, 2) || element.emoji,
                            }
                          : element,
                    );
                  }}
                  placeholder="Edit selected item"
                  value={extractSelectedLabel(selectedElement)}
                />
              ) : null}
              <div className="flex gap-2">
                {selectedElement.kind !== "image" ? (
                  <>
                    <button
                      className="rounded-full border border-[#dfeaf2] bg-white px-3 py-2 text-sm text-[var(--color-night)]"
                      onClick={() =>
                        updateElement(selectedElement.id, (element) => ({
                          ...element,
                          fontSize:
                            "fontSize" in element ? Math.max(18, element.fontSize - 2) : 26,
                        }))
                      }
                      type="button"
                    >
                      A-
                    </button>
                    <button
                      className="rounded-full border border-[#dfeaf2] bg-white px-3 py-2 text-sm text-[var(--color-night)]"
                      onClick={() =>
                        updateElement(selectedElement.id, (element) => ({
                          ...element,
                          fontSize:
                            "fontSize" in element ? Math.min(52, element.fontSize + 2) : 32,
                        }))
                      }
                      type="button"
                    >
                      A+
                    </button>
                  </>
                ) : null}
                <button
                  className="rounded-full border border-[#efd5dd] bg-[#fff5f7] px-3 py-2 text-sm text-[#9b5e72]"
                  onClick={removeSelected}
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--color-night)]">
              Tap anything on the card to edit or move it.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
