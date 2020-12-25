// import { TPosition } from "./index";
import { Room } from "colyseus.js";

import { TPosition } from ".";

export type TMovePosition = TPosition;
export type TOnMove = (props: TMovePosition) => void;
export type TOnSkinChange = (props: string) => void;
export type TOnPickSkin = (props: {
  success: boolean;
  finishedFirst: boolean;
  skin: { type: "color" | "shape"; value: string };
  playerId: string;
}) => void;
export type TOnReady = (props: string) => void;
export type TPickSkin = {
  type: "color" | "shape";
  value: string;
  playerId: string;
};

export type TRoomClient = {
  state: {
    listen: {
      (listener: "skinChange", props: TOnSkinChange): void;
      /**will only fire on the person who picks last */
      (listener: "declarePlayers", props: (props: boolean) => void): void;
    };
  };
  send: {
    (action: "move", props: TMovePosition): void;
    (action: "skinChange", props: string): void;
    (action: "pickSkin", props: TPickSkin): void;
  };
  onMessage: {
    (
      listener: "readyPlayers",
      props: (props: { [key: string]: string }) => void
    ): void;
    (listener: "pickSkin", props: TOnPickSkin): void;
    (listener: "startGame", props: (props: boolean) => void): void;
    (listener: "busyPlayers", props: (props: number) => void): void;
    (listener: "move", props: (props: TMovePosition) => void): void;
    (listener: "countDownPickSkin", props: (props: number) => void): void;
  };
} & Omit<Room<unknown>, "send">;
