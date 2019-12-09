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
  shape: string;
  primaryColor: string;
  secondaryColor: string;
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

export interface IDefs {
  openingDef: string;
  closingDef: string;
  circle: string;
  cross: string;
  triangle: string;
  [key: string]: any;
}

export interface IallShapes {
  circle: string;
  cross: string;
  triangle: string;
  [key: string]: any;
}

export interface Isvg extends IallShapes {
  defs: IDefs;
}

export interface IeventListenerOrder {
  [key: string]: string;
  player1BtnOptions: string;
  player2BtnOptions: string;
  dropDown: string;
}
