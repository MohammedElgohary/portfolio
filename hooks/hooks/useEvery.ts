import { useEffect, useRef } from "react";
interface IUseEveryProps {
  duration: number;
  callback: () => void;
  condition?: boolean;
}

export function useEvery({
  duration,
  callback,
  condition = true,
}: IUseEveryProps) {
  const timer = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (condition) timer.current = setInterval(callback, duration);

    return () => {
      clearInterval(timer.current);
    };
  }, [condition, duration]);
}
