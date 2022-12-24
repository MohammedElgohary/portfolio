import { useEffect } from "react";

export interface IUseOnEnterSection {
  selectors: string;
  delay?: number;
  onShown?: (element: Element) => void;
  onHidden?: (element: Element) => void;
}
export const useOnEnterSection = ({
  selectors,
  delay = 0,
  onShown,
  onHidden,
}: IUseOnEnterSection) => {
  useEffect(() => {
    let observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onShown?.(entry.target);
        } else {
          onHidden?.(entry.target);
        }
      });
    });

    const elements = document.querySelectorAll(selectors);

    elements.forEach((element) => observer.observe(element));
  }, [selectors, onShown, onHidden]);
};
