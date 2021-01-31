import { TPosition } from "../../ts/index";
import { state } from "../state";
import { getCurrentPlayer, getOppositePlayer } from "./player";
import { decideMove, delayAi } from "./ai";

export const goAI = async ({ delay }: { delay?: number } = {}) => {
  const { game } = state;
  if (game.gameOver) return;
  if (!game.hasAI) return;

  const player = getCurrentPlayer();

  if (!player.isAI) return;

  await delayAi(delay);
  // ai decides best move
  // could return multiple positions if cheater
  const position = decideMove(player);

  // mark board
  markBoard(position);
  // check if ai won
  checkBoardForWinner();
  // change turn
  changeTurn();
};

export const markBoard = (positions: TPosition | TPosition[]) => {
  const { game } = state;
  const { board } = game;
  const player = getCurrentPlayer();

  const mark = ({ row, column }: TPosition) => {
    if (isCellEmpty({ row, column })) return;

    board[row][column] = player.mark;
    // change to array
    game.markedPositions.push({ column, row });
  };

  if (Array.isArray(positions)) {
    positions.forEach((position) => {
      mark(position);
    });
    return;
  }

  const position = positions;
  mark(position);
};

export const startTurn = ({ column, row }: { row: number; column: number }) => {
  // start player
  markBoard({ column, row });
  // check if player won
  checkBoardForWinner();
  // change turn
  changeTurn();
};

const checkBoardForWinner = () => {
  const { game } = state;
  const { board } = game;
  const player = getCurrentPlayer();
  if (game.gameOver) return;
  // check row
  for (let row = 0; row < board.length; row++) {
    if (board[row].every((item) => item === player.mark)) {
      game.winPosition = `ROW_${row}`;
      game.gameOver = true;
      game.winner = player.id;
      game.loser = getOppositePlayer(player.id).id;
      return;
    }

    // check column
    const item = row;
    let count = 0;
    for (let column = 0; column < board.length; column++) {
      if (board[column][item] === player.mark) {
        count++;
        if (count === board.length) {
          game.winPosition = `COL_${item}`;
          game.gameOver = true;
          game.winner = player.id;
          game.loser = getOppositePlayer(player.id).id;
          return;
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
      if (diagTopLeft === board.length) {
        game.winPosition = "DIAG_TOP_LEFT";
        game.gameOver = true;
        game.winner = player.id;
        game.loser = getOppositePlayer(player.id).id;
        return;
      }
    }
    if (board[i][board.length - 1 - i] === player.mark) {
      diagBotLeft++;
      if (diagBotLeft === board.length) {
        game.winPosition = "DIAG_BOT_LEFT";
        game.gameOver = true;
        game.winner = player.id;
        game.loser = getOppositePlayer(player.id).id;
        return;
      }
    }
  }

  // check cat's game
  if (board.every((row) => row.every((item) => typeof item !== "number"))) {
    game.gameTie = true;
    game.gameOver = true;
  }
};

const changeTurn = () => {
  const { game, players } = state;
  const [player1, player2] = players;

  if (game.playerTurn === player1.id) {
    game.playerTurn = player2.id;
    return;
  }

  game.playerTurn = player1.id;
  // game.markedPositions = [];
};

const isCellEmpty = ({ row, column }: { row: number; column: number }) =>
  typeof state.game.board[row][column] === "string";

export const resetForNextGame = () => {
  const { game } = state;

  game.gameOver = false;
  game.gameTie = false;
  game.gameRunning = true;
  game.winPosition = "";
  game.winner = null;
  game.loser = null;
  game.board = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  game.markedPositions = [];
};
