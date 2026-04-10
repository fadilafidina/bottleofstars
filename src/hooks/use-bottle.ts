import { useEffect, useState } from "react";

import { fetchBottleBySlug, type BottleMode } from "../lib/api";

import type { Bottle } from "../types/bottle";

type State = {
  bottle: Bottle | null;
  error: string | null;
  isLoading: boolean;
};

export function useBottle(slug?: string, token?: string | null, mode: BottleMode = "guest") {
  const [state, setState] = useState<State>({
    bottle: null,
    error: null,
    isLoading: Boolean(slug && token),
  });

  useEffect(() => {
    if (!slug || !token) {
      setState({
        bottle: null,
        error: "Missing bottle slug or token.",
        isLoading: false,
      });
      return;
    }

    let ignore = false;

    setState((current) => ({ ...current, isLoading: true, error: null }));

    fetchBottleBySlug(slug, token, mode)
      .then(({ bottle }) => {
        if (ignore) {
          return;
        }

        setState({ bottle, error: null, isLoading: false });
      })
      .catch((error: Error) => {
        if (ignore) {
          return;
        }

        setState({
          bottle: null,
          error: error.message || "Unable to load this bottle.",
          isLoading: false,
        });
      });

    return () => {
      ignore = true;
    };
  }, [mode, slug, token]);

  return state;
}
