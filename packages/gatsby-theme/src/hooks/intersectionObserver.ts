let intersectionObserver: IntersectionObserver;

export type Unobserver = () => void;

const ioEntryMap = new WeakMap<HTMLElement, () => void>();

export function createIntersectionObserver(
  callback: () => void,
): (element: HTMLElement) => Unobserver {
  // if we don't support intersectionObserver we don't lazy load (Sorry IE 11).
  if (!(`IntersectionObserver` in window)) {
    return function observe(): Unobserver {
      callback();
      return function unobserve(): void {
        /* noop */
      };
    };
  }

  if (!intersectionObserver) {
    intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get the matching entry's callback and call it
          ioEntryMap.get(entry.target as HTMLElement)?.();
          // We only need to call it once
          ioEntryMap.delete(entry.target as HTMLElement);
        }
      });
    });
  }

  return function observe(element: HTMLElement): Unobserver {
    // Store a reference to the callback mapped to the element being watched
    ioEntryMap.set(element, callback);
    intersectionObserver.observe(element);

    return function unobserve(): void {
      if (intersectionObserver && element) {
        ioEntryMap.delete(element);
        intersectionObserver.unobserve(element);
      }
    };
  };
}
