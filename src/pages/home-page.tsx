import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { BottleShell } from "../components/bottle/bottle-shell";
import { FloatingStar } from "../components/bottle/floating-star";
import { buttonVariants } from "../components/ui/button";

const demoStars = [
  { color: "#A7D8FF", top: "22%", left: "26%" },
  { color: "#FFF3DA", top: "34%", left: "54%" },
  { color: "#F4C4D7", top: "48%", left: "38%" },
  { color: "#EEDC9A", top: "58%", left: "60%" },
  { color: "#CFE7C7", top: "69%", left: "30%" },
];

export function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between gap-12 lg:flex-row lg:items-center">
        <section className="max-w-xl pt-8 lg:pt-0">
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--color-night)]/80">
            Private memory bottle
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none text-[var(--color-ink)] sm:text-6xl">
            Little stars for someone to discover later.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[var(--color-night)] sm:text-lg">
            Bottle of Stars is a dreamy space where friends and family leave
            messages that gather inside a bottle until it is time to open them.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={buttonVariants()} to="/admin">
              Create a bottle
            </Link>
            <Link
              className={buttonVariants("secondary")}
              to="/bottle/demo/view?token=preview"
            >
              Preview the bottle
            </Link>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-xl">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(185,220,251,0.52),rgba(185,220,251,0)_62%)] blur-3xl"
            transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
          />
          <div className="relative mx-auto w-full max-w-md">
            {demoStars.map((star, index) => (
              <div
                className="absolute inset-0"
                key={`${star.color}-${star.left}`}
                style={{ top: star.top, left: star.left }}
              >
                <FloatingStar color={star.color} delay={index * 0.5} />
              </div>
            ))}
            <BottleShell>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-night)]/80">
                Preview bottle
              </p>
              <p className="mt-2 text-lg font-medium text-[var(--color-ink)]">
                14 stars waiting
              </p>
            </BottleShell>
          </div>
        </section>
      </div>
    </main>
  );
}
