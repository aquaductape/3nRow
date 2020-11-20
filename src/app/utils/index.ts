export const flattenArr = <T>(arr: T[]): any[] => {
  const flatArr: any[] = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      flatArr.push(...flattenArr(item));
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
