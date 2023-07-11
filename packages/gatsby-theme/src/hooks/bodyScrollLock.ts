import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import { useEffect, useRef } from "react";

export function useBodyScrollLock<T extends HTMLElement = HTMLElement>(
  doLock: boolean,
): { ref: React.RefObject<T> } {
  const ref = useRef<T>(null);

  useEffect(() => {
    const current = ref.current;
    if (current && doLock) {
      disableBodyScroll(current, { reserveScrollBarGap: true });
      return () => clearAllBodyScrollLocks();
    }
    return undefined;
  }, [doLock]);

  return { ref };
}
