import { state, TColors, TPlayer, TShapes } from "../state";
import { decideMove } from "./ai";

type TSetShapesProp = {
  [key: string]: TShapes;
};

export const resetForNextGame = () => {
  const { game } = state;

  game.gameOver = false;
  game.gameTie = false;
  game.winPosition = "";
  game.winner = null;
  game.board = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  game.markedPosition = { row: 0, column: 0 };
};

export const setShapes = (shapes: TSetShapesProp) => {
  const setShape = ({ player, shape }: { shape: TShapes; player: TPlayer }) => {
    player.svgShapes = shape;
  };

  state.players.forEach((player) =>
    setShape({ player, shape: shapes[player.id] })
  );
};

export const setPlayerCurrentShape = ({
  player,
  shape,
}: {
  shape: string;
  player: TPlayer;
}) => {
  player.shape = shape;
};

export const setPlayerCurrentColor = ({
  player,
  color,
}: {
  color: string;
  player: TPlayer;
}) => {
  player.color = color as TColors;
};

export const getCurrentPlayer = () =>
  state.players.find(({ id }) => state.game.playerTurn === id)!;

export const startGame = () => (state.game.gameStart = true);

export const setPlayerAsHumanOrAI = ({
  ai,
  id,
}: {
  id: string;
  ai: boolean;
}) => {
  const { players, game } = state;
  const player = players.find((player) => player.id === id)!;

  player.isAI = ai;
  game.hasAI = ai;
};

export const goAI = async () => {
  const { game } = state;
  if (game.gameOver) return;
  if (!game.hasAI) return;

  const player = getCurrentPlayer();

  if (!player.isAI) return;

  await delayAi();
  // ai decides best move
  const position = decideMove(player);

  // mark board
  markBoard(position);
  // check if ai won
  checkBoardForWinner();
  // change turn
  changeTurn();
};

export const markBoard = ({ column, row }: { row: number; column: number }) => {
  // at view, before calling this model function
  // add data attribute to guard additional clicks
  const { game } = state;
  const { board } = game;
  const player = getCurrentPlayer();

  if (isCellEmpty({ column, row })) return;

  board[row][column] = player.mark;
  game.markedPosition = {
    column,
    row,
  };
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
        return;
      }
    }
    if (board[i][board.length - 1 - i] === player.mark) {
      diagBotLeft++;
      if (diagBotLeft === board.length) {
        game.winPosition = "DIAG_BOT_LEFT";
        game.gameOver = true;
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
};

const isCellEmpty = ({ row, column }: { row: number; column: number }) =>
  typeof state.game.board[row][column] === "string";

const delayAi = (time = 900) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), time);
  });
};
