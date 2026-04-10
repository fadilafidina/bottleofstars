import type { PropsWithChildren } from "react";

import { motion } from "framer-motion";

import { Card } from "../ui/card";

export function BottleShell({ children }: PropsWithChildren) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      className="relative mx-auto flex aspect-[4/5] w-full max-w-[22rem] items-end justify-center"
      transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
    >
      <div className="absolute inset-x-[29%] top-[3%] h-[13%] rounded-b-3xl rounded-t-xl border border-[#d9e9f5] bg-white/85 backdrop-blur-md" />
      <div className="absolute inset-x-[10%] top-[11%] bottom-[5%] rounded-[44%_44%_34%_34%/18%_18%_28%_28%] border border-[#d6e7f6] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(236,245,252,0.48))] shadow-[inset_0_1px_30px_rgba(255,255,255,0.82),0_25px_60px_rgba(178,201,222,0.3)]" />
      <div className="absolute inset-x-[16%] top-[22%] bottom-[15%] rounded-[40%_40%_30%_30%/16%_16%_24%_24%] bg-[radial-gradient(circle_at_top,rgba(185,220,251,0.46),rgba(255,255,255,0.06)_60%)]" />
      <Card className="absolute bottom-0 w-[88%] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(249,246,241,0.68))] px-5 py-4 text-center">
        {children}
      </Card>
    </motion.div>
  );
}
