import { state, TColors, TPlayer, TShapes } from "../state";
import { decideMove } from "./ai";

type TSetShapesProp = {
  [key: string]: TShapes;
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

export const goAI = () => {
  const { game } = state;
  if (!game.hasAI) return;

  const player = getCurrentPlayer();

  if (!player.isAI) return;

  // ai marks board
  const position = decideMove(player);
  game.markedPosition = position;
  // game.board
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
  const { game, players } = state;
  // start player
  markBoard({ column, row });

  // change turn
  changeTurn();
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
