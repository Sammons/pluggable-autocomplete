export const Strictly = <T extends { [k: string]: S }, S extends string>(
  o: T
) => o as T;

export function AtPath<T, A extends keyof T>(o: T, a: A): T[A] 
export function AtPath<T, A extends keyof T, B extends keyof T[A]>(o: T, a: A, b:B): T[A][B] 
export function AtPath<T, A extends keyof T, B extends keyof T[A], C extends keyof T[A][B]>(o: T, a: A, b:B, c:C): T[A][B][C] 
export function AtPath(originalValue: any, ...keys) {
  let cannotProceedWith = (value) => !originalValue || typeof originalValue !== 'object';
  
  if (cannotProceedWith(originalValue)) {
    return void 0;
  }
  
  let currentValue = originalValue;
  for (let i = 0; i < keys.length; ++i) {
    currentValue = currentValue[keys[i]];
    if (cannotProceedWith(currentValue)) {
      return void 0;
    }
  }
  
  return currentValue;
}

export const StrEnum = <V extends string>(...args: V[]) => {
  let o = {} as any;
  for (let key of args) {
    o[key] = key;
  }
  return o as { [K in V]: K }
}