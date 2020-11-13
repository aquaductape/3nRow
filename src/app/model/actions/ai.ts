import { flattenArr } from "../../utils/index";
import { state, TBoard, TPlayer } from "../state";
import miniMax from "./minMax";

export type TFlattenBoard = (number | "X" | "O")[];

export type cellCostItem = {
  score: number;
  cell: { row: number; column: number };
};

export interface IMove {
  index: number;
  score: number;
}

export interface IOptionsCheckBoard {
  terminal_state: boolean;
}

export const delayAi = (time: number = 900) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), time);
  });
};

const willPickRandom = () => {
  return Math.floor(Math.random() * 3) === 0;
};

const pickRandom = (board: TFlattenBoard): number => {
  const randomIdx = Math.floor(Math.random() * board.length) + 1;

  if (typeof board[randomIdx] !== "number") return pickRandom(board);
  return randomIdx;
};

// returns the available spots on the board
const emptyIndexies = (board: TFlattenBoard) => {
  return board.filter((s) => s !== "O" && s !== "X");
};

export const decideMove = (player: TPlayer) => {
  return convertIdxToRowCol(moveIdxResult(player));
};

const moveIdxResult = (player: TPlayer) => {
  const {
    game: { board },
  } = state;
  const flattenBoard = flattenArr(board);
  const playerMark = player.mark;
  let positionIdx = 0;
  if (emptyIndexies(flattenBoard).length === 0) return 0;
  // if (cheating) {
  //   return pickRandom(flattenBoard);
  // }
  // if (gameData.aiDifficulty === "HARD") {
  //   if (willPickRandom()) {
  //     return pickRandom(flattenBoard);
  //   }
  // }

  return miniMax(flattenBoard, playerMark).index;
};

const randomRoundAmount = (rounds: number = 0) => {
  return Math.floor(Math.random() * rounds);
};

const convertIdxToRowCol = (idx: number) => {
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
