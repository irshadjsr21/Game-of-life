import { useEffect, useRef, useState } from "react";

export function useStateWithRef<T>(initialValue: T) {
  const ref = useRef<T>(initialValue);
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return [value, setValue, ref] as const;
}
