// import { TPosition } from "./index";
import { Room } from "colyseus.js";

import { TPosition } from ".";

export type TMovePosition = TPosition;
export type TOnMove = (props: TMovePosition) => void;
export type TOnSkinChange = (props: string) => void;
export type TOnReady = (props: string) => void;

export type TRoomClient = {
  state: {
    listen: {
      (listener: "skinChange", props: TOnSkinChange): void;
      (listener: "pickSkin", props: TOnSkinChange): void;
      (listener: "ready", props: TOnReady): void;
      (listener: "delayedInterval", props: (props: any) => void): void;
      (listener: "clock", props: (props: any) => void): void;
    };
  };
  send: {
    (action: "move", props: TMovePosition): void;
    (action: "moveStr", props: string): void;
    (action: "skinChange", props: string): void;
    (action: "pickSkin", props: string): void;
  };
  onMessage: {
    (
      listener: "ready",
      props: (props: { [key: string]: string }) => void
    ): void;
    (listener: "busyPlayers", props: (props: number) => void): void;
    (listener: "move", props: (props: TMovePosition) => void): void;
  };
} & Omit<Room<unknown>, "send">;
