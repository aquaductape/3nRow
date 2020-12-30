import { randomItemFromArr } from "../../utils/index";
import { getOppositePlayer } from "../../views/utils";
import { state, TColors, TPlayer, TShapes } from "../state";

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

export const setPickedSkinInLobby = ({
  type,
  item,
}: {
  type: string;
  item: string;
}) => {
  const { pickedItems } = state.onlineMultiplayer;

  state.onlineMultiplayer.hasPickedSkin = true;
  pickedItems[type] = item;
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

export const setFirstMove = (whoMoves: string) => {
  const { game } = state;

  game.firstMove = whoMoves as any;
};

export const setMultiplayerPlayers = ({
  mainPlayer,
  opponentPlayer,
}: {
  mainPlayer: string;
  opponentPlayer: string;
}) => {
  const { onlineMultiplayer } = state;

  onlineMultiplayer.mainPlayer = mainPlayer;
  onlineMultiplayer.opponentPlayer = opponentPlayer;
};

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

export const setNextPlayerForFirstMove = () => {
  const { game, players } = state;
  const { firstMove, firstMovePlayer, winner, gameTie } = game;

  if (firstMove === "alternate") {
    const nextPlayer = getOppositePlayer({ id: firstMovePlayer, players }).id;

    game.playerTurn = nextPlayer;
    game.firstMovePlayer = nextPlayer;

    return;
  }

  if (firstMove === "winner") {
    if (gameTie) {
      game.playerTurn = game.firstMovePlayer;
      return;
    }
    const nextPlayer = winner!;
    game.playerTurn = nextPlayer;
    game.firstMovePlayer = nextPlayer;
    return;
  }

  if (firstMove === "loser") {
    if (gameTie) {
      game.playerTurn = game.firstMovePlayer;
      return;
    }

    const nextPlayer = getOppositePlayer({ id: winner!, players }).id;
    game.playerTurn = nextPlayer!;
    game.firstMovePlayer = nextPlayer!;
  }
};

export const setAiDifficulty = ({
  id,
  difficulty,
}: {
  id: string;
  difficulty?: string;
}) => {
  const { players } = state;
  const player = players.find((player) => player.id === id)!;

  player.difficulty = difficulty ? difficulty.toUpperCase() : player.difficulty;
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

/** clear player previous position(s*) that marked the cell(s*). *multiple when ai cheats and takes several positions instead of one  */
export const clearMarkedPositions = () => {
  state.game.markedPositions = [];
};

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
