import { useMemo } from "react";

export function usePaginatorEntries(
  totalPages: number,
  currentPage: number,
  maxEntries = 6
): ReadonlyArray<number | undefined> {
  return useMemo(() => {
    const entries: Array<number | undefined> = [];
    if (totalPages < maxEntries) {
      for (let i = 1; i <= totalPages; i++) {
        entries.push(i);
      }
    } else {
      if (currentPage > 2) {
        entries.push(1);
        entries.push(undefined);
      }

      for (
        let index = Math.max(1, currentPage - 1);
        index <= Math.min(currentPage + 1, totalPages);
        index++
      ) {
        entries.push(index);
      }
      if (currentPage < totalPages - 2) {
        entries.push(undefined);
        entries.push(totalPages);
      }
    }
    return entries;
  }, [totalPages, currentPage, maxEntries]);
}
