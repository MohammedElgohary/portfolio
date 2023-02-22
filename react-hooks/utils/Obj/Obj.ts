export class Obj {
  static get(obj: object, key: string, defaultValue: any = null) {
    return obj[key] || defaultValue;
  }

  static set(obj: object, key: unknown, value: any = null) {
    if (value && typeof key === "string") obj[key] = value;
    else Object.assign(obj, key);

    return this;
  }
}
