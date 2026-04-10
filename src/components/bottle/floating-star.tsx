import { motion } from "framer-motion";

import { cn } from "../../lib/utils";

type FloatingStarProps = {
  active?: boolean;
  color: string;
  delay?: number;
  dimmed?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

export function FloatingStar({
  active = false,
  color,
  delay = 0,
  dimmed = false,
  size = "md",
}: FloatingStarProps) {
  return (
    <motion.span
      animate={{
        y: active ? [0, -10, 0] : [0, -6, 0],
        opacity: dimmed ? 0.42 : 1,
        scale: active ? [1, 1.12, 1] : dimmed ? 0.92 : 1,
        rotate: active ? [-8, 8, -8] : [-6, 4, -6],
      }}
      className={cn("absolute", sizeMap[size])}
      style={{
        filter: dimmed
          ? `drop-shadow(0 0 10px ${color}55)`
          : active
            ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 28px ${color})`
            : `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color}aa)`,
      }}
      transition={{
        duration: active ? 2.6 : 4 + delay,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <svg
        className="h-full w-full"
        fill={color}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 4L61 33L92 33L67 51L76 82L50 63L24 82L33 51L8 33L39 33L50 4Z" />
      </svg>
    </motion.span>
  );
}
