import { TPosition } from "../../ts/index";
import { randomItemFromArr } from "../../utils/index";
import gameContainerView from "../../views/gameContainer/gameContainerView";
import playerBtnGroupView from "../../views/playerOptions/playerBtnGroupView";
import { state, TColors, TPlayer, TShapes } from "../state";
import { decideMove, delayAi } from "./ai";

type TSetShapesProp = {
  [key: string]: TShapes;
};

export const updateStateFromLS = () => {
  const { players } = state;
  try {
    players.forEach((player) => {
      const { id } = player;
      player.color = (getLS({ id, type: "color" }) as TColors) || player.color;
      player.shape = getLS({ id, type: "shape" }) || player.shape;
      player.score = Number(getLS({ id, type: "score" })) || player.score;
    });
  } catch (err) {
    console.error(err);
  }
};

export const resetForNextGame = () => {
  const { game } = state;

  game.gameOver = false;
  game.gameTie = false;
  game.gameRunning = true;
  game.winPosition = "";
  game.winner = null;
  game.board = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];
  game.markedPositions = [];
};

export const runGameOver = () => {
  const { game } = state;
  game.gameRunning = false;
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
  setLS({ id: player.id, type: "shape", value: shape });
};

export const setPlayerCurrentColor = ({
  player,
  color,
}: {
  color: string;
  player: TPlayer;
}) => {
  player.color = color as TColors;
  setLS({ id: player.id, type: "color", value: color });
};

export const getCurrentPlayer = () =>
  state.players.find(({ id }) => state.game.playerTurn === id)!;
export const getAiPlayer = () => state.players.find(({ isAI }) => isAI)!;
export const getPlayerById = (id: string) =>
  state.players.find((player) => player.id === id);
export const getWinner = () => getPlayerById(state.game.winner!);
export const increaseWinnerScore = () => {
  const player = getWinner();

  if (!player) return;

  player.score++;
  setLS({ id: player.id, type: "score", value: player.score });
};

export const startGame = () => {
  state.game.gameStart = true;
  state.game.gameRunning = true;
};

export const setCurrentPlayer = (id: string) => {
  state.game.playerTurn = id;
};

export const setPlayerAsHumanOrAI = ({
  ai,
  id,
  difficulty,
}: {
  id: string;
  ai: boolean;
  difficulty?: string;
}) => {
  const { players, game } = state;
  const player = players.find((player) => player.id === id)!;

  player.isAI = ai;
  game.hasAI = ai;
  if (ai) {
    player.difficulty = difficulty || player.difficulty;
  }
};

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
        return;
      }
    }
    if (board[i][board.length - 1 - i] === player.mark) {
      diagBotLeft++;
      if (diagBotLeft === board.length) {
        game.winPosition = "DIAG_BOT_LEFT";
        game.gameOver = true;
        game.winner = player.id;
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

// !!!!!!!!!!!!!!!!!!!!!!!!!!!
export const randomChangePlayerSkin = (player: TPlayer) => {
  const { players } = state;

  // !!!!!!! duplicated, already defined on constants in View, I should restructure where this constant is stored
  const shapes = ["circle", "cross", "triangle", "heart"];
  // !!!!!!! duplicated, already defined on constants in View, I should restructure where this constant is stored
  const colors = [
    "sky_blue,cyan",
    "green,yellow",
    "red,orange",
    "magenta,pink",
    "purple,blue",
    "white,grey",
  ];

  const otherPlayer = players.filter(({ id }) => id !== player.id)[0];
  const filteredShapes = shapes.filter(
    (shape) => shape !== player.shape && shape !== otherPlayer.shape
  );
  const filteredColors = colors.filter(
    (shape) => shape !== player.color && shape !== otherPlayer.color
  );

  player.shape = randomItemFromArr(filteredShapes);
  player.color = randomItemFromArr(filteredColors as TColors[]);

  setLS({ id: player.id, type: "color", value: player.color });
  setLS({ id: player.id, type: "shape", value: player.shape });
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

/** clear player previous position(s*) that marked the cell(s*). *multiple when ai cheats and takes several positions instead of one  */
export const clearMarkedPositions = () => {
  state.game.markedPositions = [];
};

const isCellEmpty = ({ row, column }: { row: number; column: number }) =>
  typeof state.game.board[row][column] === "string";

const setLS = ({
  id,
  type,
  value,
}: {
  id: string;
  type: "color" | "shape" | "score";
  value: number | string;
}) => {
  try {
    localStorage.setItem(`${id}_${type}`, value.toString());
  } catch (err) {
    console.error(err);
  }
};

const getLS = ({
  id,
  type,
}: {
  id: string;
  type: "color" | "shape" | "score";
}) => {
  return localStorage.getItem(`${id}_${type}`);
};
