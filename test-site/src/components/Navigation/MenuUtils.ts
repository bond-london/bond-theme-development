import { useCallback, useEffect, useRef, useState } from "react";
import { INavigationItem } from "./NavigationMenu";

export function useMenuInformation(closeMenu?: () => void) {
  const [activeItem, setActiveItem] = useState<{
    timeStamp: number;
    link: INavigationItem;
  }>();
  const containerRef = useRef<HTMLUListElement>(null);
  const handleActive = useCallback(
    (timeStamp: number, to?: INavigationItem, from?: INavigationItem) => {
      setActiveItem((current) => {
        if (current && timeStamp === current.timeStamp) {
          return current;
        }
        const currentLink = current?.link;
        if (from) {
          if (currentLink === from) {
            return to ? { timeStamp, link: to } : undefined;
          }
          return currentLink ? { timeStamp, link: currentLink } : undefined;
        }
        if (currentLink === to) {
          return undefined;
        }
        return to ? { timeStamp, link: to } : undefined;
      });
    },
    [],
  );
  const handleClose = useCallback(() => {
    setActiveItem(undefined);
    closeMenu?.();
  }, [closeMenu]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setActiveItem(undefined);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { containerRef, handleActive, handleClose, activeItem };
}

export function useNestedMenu(
  item: INavigationItem,
  activateMenu?: (
    timeStamp: number,
    item?: INavigationItem,
    from?: INavigationItem,
  ) => void,
) {
  const handleButtonClick = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      activateMenu?.(ev.timeStamp, item);
    },
    [activateMenu, item],
  );

  const handleMouseEnter = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      activateMenu?.(ev.timeStamp, item);
    },
    [activateMenu, item],
  );
  const handleMouseLeave = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) =>
      activateMenu?.(ev.timeStamp, undefined, item),
    [activateMenu, item],
  );

  return { handleButtonClick, handleMouseEnter, handleMouseLeave };
}
