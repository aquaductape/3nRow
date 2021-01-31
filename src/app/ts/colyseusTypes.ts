// import { TPosition } from "./index";
import { Room } from "colyseus.js";

import { TPosition } from ".";

export type TReadyPlayersResult = {
  id: string;
  roomType: "public" | "private";
  /** the player that created private room */
  isHost: boolean;
};
export type TRoomCode = string;
export type TMovePosition = TPosition;
export type TOnMove = (props: TMovePosition) => void;
export type TOnPickSkin = (props: {
  success: boolean;
  finishedFirst: boolean;
  skin: { type: "color" | "shape"; value: string };
  playerId: string;
}) => void;
export type TOnReady = (props: string) => void;
export type TPickSkinPreGame = {
  type: "color" | "shape";
  value: string;
  playerId: string;
};
export type TPickSkin = TPickSkinPreGame & { prevValue: string };
export type TDeclarePlayers = {
  P1: {
    color: string;
    shape: string;
  };
  P2: {
    color: string;
    shape: string;
  };
  [key: string]: { color: string; shape: string };
};
type TPlayAgainResult = {
  firstMovePlayer: string;
};

export type TRoomClient = {
  send: {
    (action: "move", props: TMovePosition): void;
    (action: "pickSkin", props: TPickSkin): void;
    (action: "pickSkinPreGame", props: TPickSkinPreGame): void;
    (action: "prepareGame", props: boolean): void;
    (action: "votePlayAgain", props: any): void;
    (action: "playAgainNow", props: any): void;
  };
  onMessage: {
    (
      listener: "readyPlayers",
      props: (props: TReadyPlayersResult) => void
    ): void;
    (listener: "pickSkinPreGame", props: TOnPickSkin): void;
    (listener: "pickSkin", props: TOnPickSkin): void;
    (listener: "declarePlayers", props: (props: TDeclarePlayers) => void): void;
    (listener: "busyPlayers", props: (props: number) => void): void;
    (listener: "move", props: (props: TMovePosition) => void): void;
    (listener: "countDownPickSkin", props: (props: number) => void): void;
    (listener: "playAgain", props: (props: TPlayAgainResult) => void): void;
    (listener: "roomCode", props: (props: TRoomCode) => void): void;
    (listener: "opponentLeft", props: (props: boolean) => void): void;
  };
} & Omit<Room<unknown>, "send">;
