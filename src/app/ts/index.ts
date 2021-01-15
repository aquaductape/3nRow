export type TSkin = "color" | "shape";
export type TSkinProps = TSkin | TSkin[];
export type TPosition = { row: number; column: number };

// https://stackoverflow.com/a/51955852/8234457
export type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends { [_ in keyof T]: infer U }
  ? U
  : never;

// https://stackoverflow.com/a/55128956/8234457
// can't use it, unwieldy
// export type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
// true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>
