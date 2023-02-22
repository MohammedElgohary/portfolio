import React from "react";
import { CasherProps, CasherProviderProps } from "./casher.types";

/**
 * Class to deal with data and cash it easily
 */
export class Casher {
  protected name: string;
  protected data: any;
  protected storage: any;

  /**
   * Create a new Cache instance.
   */
  constructor({ name, initialValue, prefix = "dataFor" }: CasherProps) {
    this.name = `${prefix}#${name}`;

    this.storage = window?.localStorage
      ? window.localStorage
      : {
          getItem: (key: string) => {
            return this.data?.[key];
          },
          setItem: (key: string, value: any) => {
            this.data[key] = value;
          },
          removeItem: () => {
            delete this.data;
          },
          clear: () => {
            this.data = {};
          },
        };
    /**
     * The initial value,
     */
    this.data = JSON.parse(
      this.storage.getItem(this.name) || JSON.stringify(initialValue)
    );
    /**
     * Set data to localStorage.
     */
    if (!this.storage.getItem(this.name))
      this.storage.setItem(this.name, JSON.stringify(initialValue));
  }

  /**
   * Set a specific value to casher.
   */
  set(key: string, value: any) {
    this.data[key] = value;
    this.storage.setItem(this.name, JSON.stringify(this.data));
  }

  /**
   * Update cacher data.
   */
  update(values: any) {
    this.data = values;
    this.storage.setItem(this.name, JSON.stringify(values));
  }

  /**
   * Get a specific value from cacher.
   */
  get(key?: string) {
    return key ? this.data[key] : this.data;
  }
}
