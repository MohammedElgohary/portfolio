interface IUseEveryProps {
    duration: number;
    callback: () => void;
    condition?: boolean;
}
export declare function useEvery({ duration, callback, condition, }: IUseEveryProps): void;
export {};
