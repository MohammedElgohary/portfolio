import { useRef, useEffect } from "react";

export function usePrevious(object: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = object;
  });

  return ref.current;
}
