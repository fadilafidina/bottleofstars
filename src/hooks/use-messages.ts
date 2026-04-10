import { useCallback, useEffect, useState } from "react";

import { fetchMessages, markMessageOpened } from "../lib/api";

import type { Bottle } from "../types/bottle";
import type { Message } from "../types/message";

type State = {
  bottle: Bottle | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
};

export function useMessages(bottleId?: string, token?: string | null) {
  const [state, setState] = useState<State>({
    bottle: null,
    messages: [],
    isLoading: Boolean(bottleId && token),
    error: null,
  });

  const reload = useCallback(() => {
    if (!bottleId || !token) {
      setState({
        bottle: null,
        messages: [],
        error: "Missing bottle id or token.",
        isLoading: false,
      });
      return Promise.resolve();
    }

    setState((current) => ({ ...current, isLoading: true, error: null }));

    return fetchMessages(bottleId, token)
      .then(({ bottle, messages }) => {
        setState({ bottle, messages, isLoading: false, error: null });
      })
      .catch((error: Error) => {
        setState({
          bottle: null,
          messages: [],
          isLoading: false,
          error: error.message || "Unable to load bottle messages.",
        });
      });
  }, [bottleId, token]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const openMessage = useCallback(
    async (messageId: string) => {
      if (!bottleId || !token) {
        return null;
      }

      const { message } = await markMessageOpened(messageId, bottleId, token);

      setState((current) => ({
        ...current,
        messages: current.messages.map((entry) =>
          entry.id === message.id ? { ...entry, openedAt: message.openedAt } : entry,
        ),
      }));

      return message;
    },
    [bottleId, token],
  );

  return {
    ...state,
    openMessage,
    reload,
  };
}
