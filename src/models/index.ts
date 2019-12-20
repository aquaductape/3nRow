export interface IPlayer {
  id: string;
  displayName: string;
  svgMark: string;
  score: number;
  turn: boolean;
  ai: boolean;
  allShapes: IallShapes;
  shape: string;
  mark: "X" | "O";
  primaryColor: string;
  secondaryColor: string;
  changeShape: (shape: string) => void;
  addScore: () => void;
}

export interface Options {
  e: Event;
  playerId: string;
  aiHTML?: string;
}

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

export type TCheckBoard = (player: IPlayer, board: TBoard) => void;

export interface IGameInit {
  firstTurn?: "PLAYER1" | "PLAYER2";
  ai?: boolean;
  difficulty?: "HARD" | "IMPOSSIBLE" | "CHEATER";
  player1Shape?: "cross" | "circle";
  player2Shape?: "cross" | "circle";
  aiSpeed?: number;
  continueGame?: boolean;
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
  heart: string;
  antMenu: string;
  [key: string]: any;
}

export interface Isvg extends IallShapes {
  defs: IDefs;
}

export interface IeventListenerOrder {
  [key: string]: boolean;
  player1BtnOptions: boolean;
  player2BtnOptions: boolean;
  dropDownDifficulty: boolean;
}
