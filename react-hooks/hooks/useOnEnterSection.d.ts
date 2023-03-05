export interface IUseOnEnterSection {
    selectors: string;
    delay?: number;
    onShown?: (element: Element) => void;
    onHidden?: (element: Element) => void;
}
export declare function useOnEnterSection({ selectors, delay, onShown, onHidden, }: IUseOnEnterSection): void;
