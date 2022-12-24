import { useEffect } from "react";

type CallbackType = () => void;

export const useOnce = (callback: CallbackType) => useEffect(callback, []);
