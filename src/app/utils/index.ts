export const flattenArr = <T>(arr: T[]): any[] => {
  const flatArr: any[] = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      flatArr.push(...flattenArr(item as any));
    } else {
      flatArr.push(item);
    }
  });

  return flatArr;
};

export const randomItemFromArr = <T>(arr: T[]) => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
};

export const round = (num: number, dec: number) => {
  const [sv, ev] = num.toString().split("e");
  return Number(
    Number(Math.round(parseFloat(sv + "e" + dec)) + "e-" + dec) +
      "e" +
      (ev || 0)
  );
};

export const camelToKebabCase = (str: string) =>
  str[0].toLowerCase() +
  str
    .slice(1, str.length)
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

// https://gist.github.com/jed/982883
// https://stackoverflow.com/a/2117523/8234457
export const uuidv4 = () => {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: number) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};
