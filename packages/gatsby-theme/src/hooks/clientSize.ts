import { useCallback, useEffect, useRef, useState } from "react";

function updateClientSize(): void {
  const vw = document.documentElement.clientWidth / 100;
  const vh = document.documentElement.clientHeight / 100;
  document.documentElement.style.setProperty("--bond-vw", `${vw}px`);
  document.documentElement.style.setProperty("--bond-vh", `${vh}px`);
}

export function useBondClientSize(): void {
  useEffect(() => {
    const observer = new ResizeObserver(updateClientSize);
    updateClientSize();
    observer.observe(document.documentElement);
    return () => observer.unobserve(document.documentElement);
  }, []);
}

export function useComponentSize<T extends HTMLElement>(): [
  React.RefObject<T>,
  Array<number>
] {
  const componentRef = useRef<T>(null);
  const [size, setSize] = useState([375, 667]);
  const updateSize = useCallback(() => {
    const component = componentRef.current;
    if (component) {
      const { clientWidth, clientHeight } = component;
      setSize(oldSize => {
        const [oldWidth, oldHeight] = oldSize;
        if (oldWidth !== clientWidth || oldHeight !== clientHeight) {
          return [clientWidth, clientHeight];
        }
        return oldSize;
      });
    }
  }, []);

  useEffect(() => {
    window.onresize = updateSize;
    updateSize();
    return () => {
      window.onresize = null;
    };
  }, [updateSize]);

  return [componentRef, size];
}
