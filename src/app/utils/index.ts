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
