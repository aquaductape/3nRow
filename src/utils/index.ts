import { cellCostItem, TBoard, IMove } from "../models/index";

export const maxBy = (arr: IMove[]) => {
  let max = Number.MIN_SAFE_INTEGER;
  let value = arr[0];

  for (let item of arr) {
    if (typeof item.score === "number") {
      if (item.score > max) {
        max = item.score;
        value = item;
      }
    }
  }

  return value;
};

export const minBy = (arr: IMove[]) => {
  let min = Number.MAX_SAFE_INTEGER;
  let value = arr[0];

  for (let item of arr) {
    if (typeof item.score === "number") {
      if (item.score < min) {
        min = item.score;
        value = item;
      }
    }
  }

  return value;
};

export const copyBoard = (board: TBoard) => {
  const newBoard = [];
  for (let arr of board) {
    newBoard.push([...arr]);
  }

  return newBoard;
};

export const flattenArr = (arr: any[]) => {
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
