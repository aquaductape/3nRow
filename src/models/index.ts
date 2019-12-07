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

export type TBoard = (number | "X" | "O")[][];
export type TFlattenBoard = (number | "X" | "O")[];

export interface IPlayer {
  id: string;
  displayName: string;
  svgMark: string;
  score: number;
  turn: boolean;
  ai: boolean;
  mark: "X" | "O";
}

export type TCheckBoard = (player: IPlayer, board: TBoard) => void;

export interface IGameInit {
  firstTurn?: "PLAYER1" | "PLAYER2";
  ai?: boolean;
  difficulty?: "HARD" | "IMPOSSIBLE" | "CHEATER";
  player1Shape?: "cross" | "circle";
  player2Shape?: "cross" | "circle";
  aiSpeed?: number;
}

export interface ISetTilesAriaAll {
  init?: boolean;
  restart?: boolean;
}
