export type TShapes = {
  circle: string;
  cross: string;
  triangle: string;
  heart: string;
  [key: string]: string;
};

export type TColors =
  | "sky_blue,cyan"
  | "green,yellow"
  | "red,orange"
  | "magenta,pink"
  | "purple,blue"
  | "white,grey";

export type TPlayer = {
  id: string;
  name: string; // default Player [num]
  score: number;
  shape: string;
  // shapes
  shapes: TShapes;
  color: TColors;
  isAI: boolean;
  mark: "X" | "O";
  difficulty: string | null;
};

type TGame = {
  turn: string; // Player id
  gameOver: boolean;
  gameStarted: boolean;
  winner: string | null; // Player id
  hasAI: boolean;
};

export type TState = {
  players: TPlayer[];
  game: TGame;
};

export const state: TState = {
  players: [
    {
      id: "P1",
      score: 0,
      name: "Player 1",
      color: "sky_blue,cyan",
      shape: "cross",
      shapes: <TShapes>{},
      mark: "X",
      isAI: false,
      difficulty: null,
    },
    {
      id: "P2",
      score: 0,
      name: "Player 2",
      color: "red,orange",
      shape: "circle",
      shapes: <TShapes>{},
      mark: "O",
      isAI: false,
      difficulty: null,
    },
  ],
  game: {
    gameOver: false,
    gameStarted: false,
    turn: "P1",
    winner: null,
    hasAI: false,
  },
};
