/**
 * Cache props.
 */
export interface CasherProps {
  /**
   * The name of cache.
   */
  name: string;
  /**
   * The initial value,
   */
  initialValue: object;
  /**
   * name prefix,
   */
  prefix?: string;
}

export interface CasherProviderProps {
  /**
   * main casher.
   */
  casher: any;

  /**
   * Rest props
   */
  [key: string]: any;
}
