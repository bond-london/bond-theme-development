import { useEffect, useState } from "react";

export function useDelayedTrigger(trigger: boolean, delay: number): boolean {
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (trigger) {
      const handle = window.setTimeout(() => setDelayed(true), delay);
      return () => window.clearTimeout(handle);
    }
    return undefined;
  }, [trigger, delay]);
  return delayed;
}

export function useOneShot(trigger: boolean): boolean {
  const [triggered, setTriggered] = useState(trigger);

  useEffect(() => {
    if (trigger) {
      setTriggered(true);
    }
  }, [trigger]);
  return triggered;
}

export function useDelayedOneShot(trigger: boolean, delay: number): boolean {
  const oneShot = useOneShot(trigger);
  const delayed = useDelayedTrigger(oneShot, delay);
  return delayed;
}
