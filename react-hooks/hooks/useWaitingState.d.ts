import { Dispatch, SetStateAction } from "react";
export default function useWaitingState<T>({ delay, initialValue, preUpdate, formate, }: {
    delay?: number;
    initialValue?: T;
    preUpdate?: (val?: T) => void;
    formate?: (val: T) => T;
}): [T, (val: T) => void, Dispatch<SetStateAction<T>>];
