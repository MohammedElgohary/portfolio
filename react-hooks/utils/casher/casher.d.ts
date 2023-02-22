import { CasherProps } from "./casher.types";
export declare class Casher {
    protected name: string;
    protected data: any;
    protected storage: any;
    /**
     * Create a new Cache instance.
     */
    constructor({ name, initialValue, prefix }: CasherProps);
    /**
     * Set a specific value to casher.
     */
    set(key: string, value: any): void;
    /**
     * Update cacher data.
     */
    update(values: any): void;
    /**
     * Get a specific value from cacher.
     */
    get(key?: string): any;
}
