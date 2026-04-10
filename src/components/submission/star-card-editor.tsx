import { useEffect, useMemo, useState, type ChangeEvent, type RefObject } from "react";
import { Group, Image as KonvaImage, Layer, Rect, Stage, Text } from "react-konva";
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

const cardWidth = 640;
const cardHeight = 440;

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
const bubblePaddingX = 18;
const bubblePaddingY = 14;

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
  onRemove,
}: {
  element: StarCardImageElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (next: StarCardImageElement) => void;
  onRemove: () => void;
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
      onDblClick={onRemove}
      onDblTap={onRemove}
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
  const [textInput, setTextInput] = useState("");
  const [showTextComposer, setShowTextComposer] = useState(false);

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

  const removeElement = (id: string) => {
    onChange({
      ...design,
      elements: design.elements.filter((element) => element.id !== id),
    });

    if (selectedId === id) {
      onSelect(null);
    }
  };

  const addText = (textValue: string) => {
    const trimmed = textValue.trim();

    if (!trimmed) {
      return;
    }

    const id = crypto.randomUUID();
    onChange({
      ...design,
      elements: [
        ...design.elements,
        {
          id,
          kind: "text",
          text: trimmed,
          x: 56,
          y: 128,
          fontSize: 22,
          color: "#344255",
          rotation: -2 + Math.random() * 4,
        },
      ],
    });
    onSelect(id);
    setTextInput("");
    setShowTextComposer(false);
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
          <Rect cornerRadius={160} fill="#d8ebfd" height={120} opacity={0.8} width={180} x={284} y={18} />
          <Rect cornerRadius={160} fill="#eff7fe" height={72} opacity={0.95} width={110} x={32} y={38} />
        </>
      );
    }

    if (design.background === "blush") {
      return (
        <>
          <Rect cornerRadius={160} fill="#f6e8ee" height={120} opacity={0.9} width={180} x={-18} y={246} />
          <Rect cornerRadius={160} fill="#fff2ef" height={72} opacity={0.85} width={110} x={396} y={32} />
        </>
      );
    }

    return (
      <>
        <Rect cornerRadius={160} fill="#e8f4fe" height={96} opacity={0.95} width={156} x={354} y={24} />
        <Rect cornerRadius={160} fill="#f9f2eb" height={120} opacity={0.84} width={184} x={-24} y={238} />
      </>
    );
  }, [design.background]);

  return (
    <div className="mx-auto w-full max-w-[40rem] space-y-5">
      <div className="mx-auto flex w-full justify-center overflow-hidden rounded-[2rem] bg-transparent">
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
              shadowBlur={16}
              shadowColor="#dce9f4"
              shadowOpacity={0.35}
              width={cardWidth}
            />
            {backgroundDecor}
            <Rect
              cornerRadius={24}
              fill={background.accent}
              height={12}
              opacity={0.5}
              width={96}
              x={232}
              y={24}
            />

            {design.elements.map((element) => {
              if (element.kind === "text") {
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

                return (
                  <Group
                    draggable
                    key={element.id}
                    onClick={() => onSelect(element.id)}
                    onDblClick={() => removeElement(element.id)}
                    onDblTap={() => removeElement(element.id)}
                    onDragEnd={(event) => {
                      updateElement(element.id, () => ({
                        ...element,
                        x: event.target.x(),
                        y: event.target.y(),
                      }));
                    }}
                    x={element.x}
                    y={element.y}
                  >
                    <Rect
                      cornerRadius={20}
                      fill="rgba(255,255,255,0.92)"
                      height={bubbleHeight}
                      rotation={element.rotation}
                      shadowBlur={selectedId === element.id ? 16 : 10}
                      shadowColor="#b9dcfb"
                      shadowOpacity={0.45}
                      stroke={selectedId === element.id ? "#98c9f3" : "#edf2f7"}
                      strokeWidth={selectedId === element.id ? 2 : 1}
                      width={bubbleWidth}
                    />
                    <Rect
                      cornerRadius={10}
                      fill="rgba(255,255,255,0.92)"
                      height={16}
                      rotation={element.rotation - 14}
                      width={16}
                      x={20}
                      y={bubbleHeight - 8}
                    />
                    <Text
                      fill={element.color}
                      fontFamily="Georgia"
                      fontSize={element.fontSize}
                      height={bubbleHeight}
                      padding={bubblePaddingX}
                      rotation={element.rotation}
                      text={element.text}
                      verticalAlign="middle"
                      width={bubbleWidth}
                      wrap="word"
                    />
                  </Group>
                );
              }

              if (element.kind === "emoji") {
                return (
                  <Text
                    draggable
                    fontSize={element.fontSize}
                    key={element.id}
                    onClick={() => onSelect(element.id)}
                    onDblClick={() => removeElement(element.id)}
                    onDblTap={() => removeElement(element.id)}
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
                  onRemove={() => removeElement(element.id)}
                  onSelect={() => onSelect(element.id)}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>

      <div className="w-full space-y-4 px-1 sm:px-2">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--color-night)]/75">
            Stickers
          </p>
          <div className="flex flex-wrap gap-2">
          {emojiLibrary.map((emoji) => (
            <button
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dfeaf2] bg-white/86 text-xl transition hover:-translate-y-0.5 hover:bg-[#edf7ff]"
              key={emoji}
              onClick={() => addEmoji(emoji)}
              type="button"
            >
              {emoji}
            </button>
          ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--color-night)]/75">
            Theme
          </p>
          <div className="flex flex-wrap items-center gap-2">
          {backgrounds.map((entry) => (
            <button
              className={cn(
                "rounded-2xl border px-3 py-2 text-sm transition",
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
        </div>

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--color-night)]/75">
            Text
          </p>
          <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowTextComposer((current) => !current)}
            type="button"
            variant={showTextComposer ? "secondary" : "primary"}
          >
            Add text bubble
          </Button>
          <label className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-[#dfeaf2] bg-white/86 px-4 text-sm text-[var(--color-ink)] transition hover:bg-[#edf7ff]">
            {isUploadingPhoto ? "Adding..." : "Add photo"}
            <input accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleUpload} type="file" />
          </label>
          </div>
        </div>

        {showTextComposer ? (
          <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[#e3edf5] bg-white/76 p-4 sm:flex-row sm:items-center">
            <input
              className="h-12 flex-1 rounded-2xl border border-[#dae7f3] bg-white/88 px-4 text-[var(--color-ink)] outline-none placeholder:text-[#96a3b0]"
              onChange={(event) => setTextInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addText(textInput);
                }
              }}
              placeholder="Write a little note..."
              value={textInput}
            />
            <Button
              disabled={!textInput.trim()}
              onClick={() => addText(textInput)}
              type="button"
            >
              Drop in
            </Button>
          </div>
        ) : null}

        <p className="text-center text-sm text-[var(--color-night)]">
          Tap a sticker to drop it in. Double tap any item to remove it.
        </p>
      </div>
    </div>
  );
}
