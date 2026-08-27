import { useEffect } from "react";

interface KeyboardShortcutOptions {
  key: string;
  callback: () => void;
  ctrlOrMeta?: boolean;
}

export function useKeyboardShortcut({
  key,
  callback,
  ctrlOrMeta = false,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const matchesKey =
        event.key.toLowerCase() === key.toLowerCase();

      const matchesModifier =
        !ctrlOrMeta ||
        event.ctrlKey ||
        event.metaKey;

      if (!matchesKey || !matchesModifier) {
        return;
      }

      event.preventDefault();
      callback();
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [key, callback, ctrlOrMeta]);
}