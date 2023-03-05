import { useCallback, useState, useRef, Dispatch, SetStateAction } from "react";

export default function useWaitingState<T>({
  delay,
  initialValue,
  preUpdate,
  formate = (val: T) => val,
}: {
  delay?: number;
  initialValue?: T;
  preUpdate?: (val?: T) => void;
  formate?: (val: T) => T;
}): [T, (val: T) => void, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(formate(initialValue as T));
  const ref = useRef<NodeJS.Timer>();

  const updateSate = useCallback(
    (val: T): void => {
      if (ref.current) clearTimeout(ref.current);

      ref.current = setTimeout(() => {
        preUpdate?.(val);
        setState(formate(val));
      }, delay);
    },
    [delay, formate, preUpdate]
  );

  return [state, updateSate, setState];
}
