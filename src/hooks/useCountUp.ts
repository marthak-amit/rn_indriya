import { useEffect, useRef, useState } from 'react';

/** Tweens a number toward `target` (ease-out cubic). Used for totals and counters. */
export function useCountUp(target: number, duration = 600): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  const raf = useRef<ReturnType<typeof requestAnimationFrame> | null>(null);

  useEffect(() => {
    const start = from.current;
    if (start === target) return;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = start + (target - start) * eased;
      from.current = next;
      setValue(next);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);

  return value;
}
