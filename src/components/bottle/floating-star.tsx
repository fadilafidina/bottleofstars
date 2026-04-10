import { motion } from "framer-motion";

import { cn } from "../../lib/utils";

type FloatingStarProps = {
  color: string;
  delay?: number;
  dimmed?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
} as const;

export function FloatingStar({
  color,
  delay = 0,
  dimmed = false,
  size = "md",
}: FloatingStarProps) {
  return (
    <motion.span
      animate={{
        y: [0, -6, 0],
        opacity: dimmed ? 0.48 : 1,
        scale: dimmed ? 0.94 : 1,
        rotate: [-6, 4, -6],
      }}
      className={cn("absolute", sizeMap[size])}
      style={{
        filter: dimmed
          ? `drop-shadow(0 0 10px ${color}55)`
          : `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color}aa)`,
      }}
      transition={{
        duration: 4 + delay,
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
