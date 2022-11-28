import { useEffect, useState } from "react";

export function useMediaQuery(
  mediaQuery: string,
  initialValue = true
): boolean {
  const [matches, setMatches] = useState(initialValue);

  useEffect(() => {
    const handleChange = (list: MediaQueryListEvent): void => {
      setMatches(list.matches);
    };

    const mediaQueryList = window.matchMedia(mediaQuery);
    mediaQueryList.addEventListener("change", handleChange);
    setMatches(mediaQueryList.matches);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [mediaQuery]);

  return matches;
}
