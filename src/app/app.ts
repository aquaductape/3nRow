import data from "./gameData";
import { animateLine, addStartBtn } from "./animate";
import { randomGen } from "./dialog";
import { IPlayer, TCheckBoard } from "../models/index";
import miniMax from "./miniMax";
import { flattenArr, convertToRowCol } from "../utils/index";

const cells: NodeListOf<HTMLDivElement> = document.querySelectorAll(
  "[data-column]"
);
const stats = document.querySelector(".stats");

export const gameInit = () => {
  //Player One goes first
  // data.player2.turn = true;
  data.player1.turn = true;
  data.player2.ai = true;

  // if (data.currentPlayer().ai) {
  //   moveAi();
  // }

  if (!stats) return null;
  stats.innerHTML = `Go ${data.player1.name}!`;
};

const onAction = (e: Event) => {
  if (data.gameOver) return null;

  moveHuman(e);

  if (data.currentPlayer().ai) {
    moveAi();
  }
};

const postStats = () => {
  if (!stats || data.gameOver || data.gameTie) return null;
  stats.innerHTML = randomGen(data.currentPlayer().name);
};

cells.forEach(cell => {
  cell.addEventListener("click", onAction);
  cell.addEventListener("keydown", e => {
    const key = e.key;
    if (key === "Enter" || key === " ") {
      onAction(e);
    }
  });
});

const gameOver = () => {
  animateLine();
  addStartBtn();
  announceWinner();
};

const announceWinner = () => {
  if (!stats) return null;
  const player = data.currentPlayer();
  stats.innerHTML = `${player.name} won!`;
  data.gameOver = true;
};

const moveHuman = (e: Event) => {
  const target = <HTMLDivElement>e.currentTarget;
  const targetParent = target.parentElement;
  if (!targetParent) return;

  const row = targetParent.getAttribute("data-row");
  const column = target.getAttribute("data-column");
  const cell = <HTMLDivElement>e.currentTarget;
  if (!column || !cell || !row) return null;
  if (isCellMarked(parseInt(row), parseInt(column))) {
    return null;
  }

  const player = data.currentPlayer();
  const board = data.board;

  markBoard(parseInt(row), parseInt(column), cell);
  checkBoard(player, board);
  data.nextPlayer();
  postStats();
};

const delayAi = (time: number = 800) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), time);
  });
};

const moveAi = async () => {
  if (data.gameOver) return null;
  // const isFinished = await delayAi();

  const board = data.board;
  const player = data.currentPlayer();
  debugger;
  const cellItem = miniMax(flattenArr(board), player.mark);
  debugger;
  const { row, column } = convertToRowCol(cellItem.index);
  const cellParent = <HTMLDivElement>(
    document.querySelector(`[data-row="${row}"]`)
  );
  const cell = <HTMLDivElement>(
    cellParent.querySelector(`[data-column="${column}"]`)
  );

  markBoard(row, column, cell);
  checkBoard(data.currentPlayer(), board);
  data.nextPlayer();
  postStats();
};

const checkBoard: TCheckBoard = (player, board) => {
  if (data.gameOver || !stats) {
    return null;
  }

  // check row
  for (let row = 0; row < board.length; row++) {
    if (board[row].every(item => item === player.mark)) {
      data.winPosition = `ROW_${row}`;
      gameOver();
      return null;
    }

    // check column
    let count = 0;
    for (let column = 0; column < board.length; column++) {
      if (board[column][row] === player.mark) {
        count++;
        if (count === data.board.length) {
          data.winPosition = `COL_${row}`;
          gameOver();
          return null;
        }
      }
    }
  }

  //check diagonal
  let diagTopLeft = 0;
  let diagBotLeft = 0;
  // [0,0][1,1][2,2]
  // [0,2][1,1][2,0]
  for (let i = 0; i < board.length; i++) {
    if (board[i][i] === player.mark) {
      diagTopLeft++;
      if (diagTopLeft === data.board.length) {
        data.winPosition = "DIAG_TOP_LEFT";
        gameOver();
        return null;
      }
    }
    if (board[i][data.board.length - 1 - i] === player.mark) {
      diagBotLeft++;
      if (diagBotLeft === data.board.length) {
        data.winPosition = "DIAG_BOT_LEFT";
        gameOver();
        return null;
      }
    }
  }

  // check cat's game
  let countBoolean = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i].every(item => typeof item !== "number")) {
      countBoolean++;
    }
  }

  if (countBoolean === 3) {
    addStartBtn();
    data.gameTie = true;
    stats.innerHTML = `Cat's game!`;
  }
};

const isCellMarked = (row: number, column: number) => {
  return typeof data.board[row][column] !== "number";
};

const markBoard = (row: number, column: number, cell: HTMLDivElement) => {
  // if board already filled return nothing
  if (isCellMarked(row, column) || data.gameOver) {
    return null;
  }

  const player = data.currentPlayer();
  const fillFirstChild = cell.firstElementChild;
  if (!fillFirstChild || !stats) return null;

  fillFirstChild.innerHTML = player.shape;

  addAriaLabel(player, cell);

  data.board[row][column] = player.mark;
};

const addAriaLabel = (player: IPlayer, cell: HTMLDivElement) => {
  const parent = cell.parentElement;
  if (!parent) return null;
  const row = parent.getAttribute("data-row");
  const col = cell.getAttribute("data-column");
  cell.setAttribute(
    "aria-label",
    `Marked by ${player.name} on row ${row}, column ${col}`
  );
};
