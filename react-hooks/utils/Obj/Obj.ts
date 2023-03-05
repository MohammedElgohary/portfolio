type autoComplete<T> = keyof T | Omit<string, keyof T>;

export class Obj {
  static get<T extends object>(
    obj: T,
    key: autoComplete<T>,
    defaultValue: any = null
  ) {
    return obj[key as keyof T] || defaultValue;
  }

  static set<T extends object>(
    obj: T,
    key: autoComplete<T>,
    value: any = null
  ) {
    if (value && typeof key === "string") obj[key as keyof T] = value;
    else Object.assign(obj, key);

    return this;
  }
}
