import { useEffect } from "react";

type CallbackType = () => void;

export function useOnce(callback: CallbackType) {
  useEffect(callback, []);
}
