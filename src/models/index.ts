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
  name: string;
  shape: string;
  score: number;
  turn: boolean;
  ai: boolean;
  mark: "X" | "O";
}

export type TCheckBoard = (player: IPlayer, board: TBoard) => void;
