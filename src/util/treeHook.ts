import { useCallback, useState } from "react";

export function useTreeExpansion(initial: boolean) {
  const [ids, setIds] = useState<Set<string>>(new Set());
  const isExpanded = useCallback((id: string) => ids.has(id) !== initial, [
    ids,
    initial,
  ]);
  const toggleExpansion = useCallback(
    (id: string, expand?: boolean) => {
      if ((expand ?? !isExpanded(id)) !== initial) {
        ids.add(id);
      } else {
        ids.delete(id);
      }
      setIds(new Set(ids));
    },
    [ids, initial, isExpanded]
  );
  const resetExpansions = useCallback(
    (ids?: string[]) => setIds(new Set(ids)),
    []
  );
  return {
    isExpanded,
    toggleExpansion,
    resetExpansions,
  };
}
