import React, { cloneElement, useContext } from "react";
import { CasherProviderProps } from "./casher.types";

export const configureCasher = (casher: any) =>
  React.createContext({
    casher,
    data: casher.initialValue,
    set(key: string, value: any) {
      this.casher.set(key, value);
    },
    get(key: string) {
      return this.casher.get(key);
    },
  });

export function CasherProvider({ casher, ...props }: CasherProviderProps) {
  const CasherContext = configureCasher(casher);

  return (
    <CasherContext.Provider value={casher.get()}>
      {cloneElement(props.children, { ...props, provider: CasherContext })}
    </CasherContext.Provider>
  );
}
