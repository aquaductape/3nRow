export const flattenArr = <T>(arr: T[]): any[] => {
  const flatArr: any[] = [];
  arr.forEach(item => {
    if (Array.isArray(item)) {
      flatArr.push(...flattenArr(item));
    } else {
      flatArr.push(item);
    }
  });

  return flatArr;
};

export const convertToRowCol = (idx: number) => {
  const column = idx % 3;
  let row = 0;

  if (idx > 5) {
    row = 2;
    return { row, column };
  }
  if (idx > 2) {
    row = 1;
    return { row, column };
  }

  return { row, column };
};
