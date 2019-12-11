import gameData from "./gameData";
import { TCheckBoard, IGameInit } from "../models/index";
import { animateLine, changeLineColor } from "./UI/animate";
import { moveAi, isAiFinished, aiQueued, isAiEnabled } from "./ai/ai";
import {
  playAgainBtn,
  announceWinner,
  markBoardDOM,
  postStats
} from "./UI/board";
import { setTilesAriaPlayerTurn, setTilesAriaAll } from "./UI/aria";
import { renderScore } from "./UI/options";

export const gameOver = () => {
  gameData.winner = gameData.currentPlayer();
  animateLine();
  changeLineColor(gameData.currentPlayer());
  playAgainBtn();
  announceWinner();
  increaseScore();
  setPlayerTurn();
};

const setPlayerTurn = () => {
  gameData.firstPlayerStart = gameData.currentPlayer().id;
};

const increaseScore = () => {
  const player = gameData.currentPlayer();
  player.addScore();
  localStorage.setItem(`${player.id}-score`, player.score.toString());
  renderScore();
};

export const checkBoard: TCheckBoard = (player, board) => {
  if (gameData.gameOver) {
    return null;
  }

  // check row
  for (let row = 0; row < board.length; row++) {
    if (board[row].every(item => item === player.mark)) {
      gameData.winPosition = `ROW_${row}`;
      gameOver();
      return null;
    }

    // check column
    let count = 0;
    for (let column = 0; column < board.length; column++) {
      if (board[column][row] === player.mark) {
        count++;
        if (count === gameData.board.length) {
          gameData.winPosition = `COL_${row}`;
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
      if (diagTopLeft === gameData.board.length) {
        gameData.winPosition = "DIAG_TOP_LEFT";
        gameOver();
        return null;
      }
    }
    if (board[i][gameData.board.length - 1 - i] === player.mark) {
      diagBotLeft++;
      if (diagBotLeft === gameData.board.length) {
        gameData.winPosition = "DIAG_BOT_LEFT";
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
    gameData.gameTie = true;
    gameOver();
  }
};

export const isCellMarked = (row: number, column: number) => {
  return typeof gameData.board[row][column] !== "number";
};

export const markBoard = (row: number, column: number) => {
  // if board already filled return nothing
  if (isCellMarked(row, column) || gameData.gameOver) {
    return null;
  }

  const player = gameData.currentPlayer();

  gameData.board[row][column] = player.mark;
};

export const startGame = ({
  firstTurn = "PLAYER1",
  ai = false,
  difficulty = "IMPOSSIBLE",
  aiSpeed = 900
}: IGameInit = {}) => {
  //Player One goes first
  // data.player2.turn = true;
  if (firstTurn === "PLAYER1") {
    gameData.player1.turn = true;
  } else {
    gameData.player2.turn = true;
  }

  setTilesAriaAll({ restart: true });
  gameData.aiSpeed = aiSpeed;
  gameData.aiDifficulty = difficulty;

  gameData.player2.ai = ai;

  if (gameData.player2.turn && isAiEnabled()) {
    moveAi({});
  }
};

export const moveHuman = (
  row: number,
  column: number,
  cell: HTMLDivElement
) => {
  if (isCellMarked(row, column) || !isAiFinished()) {
    return null;
  }
  aiQueued();
  const player = gameData.currentPlayer();
  const board = gameData.board;

  markBoard(row, column);
  markBoardDOM(cell);
  checkBoard(player, board);
  nextPlayer();
  postStats();
};

const nextPlayer = () => {
  if (gameData.gameOver) return null;
  gameData.nextPlayer();
  setTilesAriaPlayerTurn();
};
