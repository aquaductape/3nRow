import gameData, { Player } from "../gameData";
import miniMax from "./miniMax";
import {
  flattenArr,
  convertToRowCol,
  randomRoundAmount,
  emptyIndexies
} from "../../utils/index";
import { markBoard, checkBoard } from "../gameLogic";
import { TFlattenBoard, TBoard } from "../../models/index";
import { getCell, markBoardDOM, postStats } from "../UI/board";

export const delayAi = (time: number = 900) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), time);
  });
};

export const startAi = () => {
  if (isCheater()) {
    console.log("cheater");
    const rounds = randomRoundAmount(2);
    for (let i = 0; i < rounds; i++) {
      moveAi({ cheating: true });
    }
  }
  moveAi();
};

export const moveAi = async ({ cheating }: { cheating?: boolean } = {}) => {
  if (gameData.gameOver) return null;

  // prevent immediate marking on the board
  await delayAi();

  const board = gameData.board;
  const player = gameData.currentPlayer();
  const cellIndex = decideMove(board, player, cheating);
  const { row, column } = convertToRowCol(cellIndex);
  const cell = getCell(row, column);
  markBoard(row, column);
  markBoardDOM(cell);
  checkBoard(gameData.currentPlayer(), board);

  if (cheating) return null;
  gameData.nextPlayer();
  gameData.aiFinished = true;
  postStats();
};

const isCheater = () => {
  return gameData.aiDifficulty === "CHEATER";
};

export const isAiFinished = () => {
  return gameData.aiFinished;
};

export const aiQueued = () => {
  if (isAiEnabled()) {
    gameData.aiFinished = false;
  }
};

export const isAiEnabled = () => {
  return gameData.player2.ai;
};

export const determineSpeed = (
  difficulty: "HARD" | "IMPOSSIBLE" | "CHEATER"
) => {
  switch (difficulty) {
    case "HARD":
      return 900;
    case "IMPOSSIBLE":
      return 900;
    default:
      return 300;
  }
};

const willPickRandom = () => {
  return Math.floor(Math.random() * 3) === 0;
};

const pickRandom = (board: TFlattenBoard): number => {
  const randomIdx = Math.floor(Math.random() * board.length) + 1;

  if (typeof board[randomIdx] !== "number") return pickRandom(board);
  return randomIdx;
};

const decideMove = (
  board: TBoard,
  player: Player,
  cheating: boolean = false
) => {
  const flattenBoard = flattenArr(board);
  const playerMark = player.mark;
  if (emptyIndexies(flattenBoard).length === 0) return 0;
  if (cheating) {
    return pickRandom(flattenBoard);
  }
  if (gameData.aiDifficulty === "HARD") {
    if (willPickRandom()) {
      console.log("picking randomly");
      return pickRandom(flattenBoard);
    }
  }

  return miniMax(flattenBoard, playerMark).index;
};
