import Colyseus from "../model/colyseus";
import model from "../model/model";
import { TRoomClient } from "../ts/colyseusTypes";
import gameMenuView from "../views/gameMenu/gameMenuView";
import lobbyView from "../views/lobby/lobbyView";
import { controlMovePlayer } from "./move";

// I think it's appropriate to place the multiplayer websocket listeners as Controller
// since ultimately the server that initiates action, was caused by a user on the other end

export type TControlJoinRoom = (props: {
  type: "private" | "public";
  password?: string;
}) => void;
export const controlJoinRoom: TControlJoinRoom = ({ type, password }) => {
  // model.joinOrCreate({ type, password });
  const client = new Colyseus.Client("ws://localhost:3000");
  let room: TRoomClient;

  if (type === "public") {
    room = client.joinOrCreate(type).then((room) => {
      console.log("client sucess PUBLIC joined: ", room.sessionId);

      model.setRoom(room as any);
      roomActions({ room: room as any, type });
    }) as any;
  }

  if (type === "private") {
    room = client
      .join(type, {
        password,
      })
      .then((room) => {
        console.log("client sucess PRIVATE joined: ", room.sessionId);
        model.setRoom(room as any);
        roomActions({ room: room as any, type });
      }) as any;
  }
};

export type TControlCreateRoom = (props: {
  type: "private" | "public";
  password?: string;
}) => void;
export const controlCreateRoom: TControlCreateRoom = ({ type, password }) => {
  const client = new Colyseus.Client("ws://localhost:3000");
  let room: TRoomClient;

  if (type === "public") {
    room = client.create(type).then((room) => {
      console.log("client sucess PUBLIC joined: ", room.sessionId);

      model.setRoom(room as any);
      roomActions({ room: room as any, type });
    }) as any;
  }

  if (type === "private") {
    room = client
      .create(type, {
        password,
      })
      .then((room) => {
        console.log("client sucess PRIVATE joined: ", room.sessionId);
        model.setRoom(room as any);
        roomActions({ room: room as any, type });
      }) as any;
  }
};

const roomActions = ({
  room,
  type,
}: {
  room: TRoomClient;
  type: "private" | "public";
}) => {
  room.onMessage("move", ({ column, row }) => {
    console.log("onMessage: ");
    controlMovePlayer({ column, row, userActionFromServer: true });
  });

  room.state.listen("skinChange", (skin) => {
    // still allow ui to update without confirmation of the server
    // but source of truth is in server
    // worse case scenario: player skin visually, will not be synced, but listener from the server will correct it, so there will be a flash change
  });
  // room.state.listen("clock", (foo) => console.log("onclock: ", foo));
  // room.state.listen("delayedInterval", (foo) => console.log("interval: ", foo));

  room.onMessage("ready", (ids) => {
    console.log("ready?", ids[room.sessionId]);
    let mainPlayer = "";
    let opponentPlayer = "";

    for (const id in ids) {
      const playerId = ids[id];
      if (id === room.sessionId) {
        mainPlayer = playerId;
      } else {
        opponentPlayer = playerId;
      }
    }
    model.setMultiplayerPlayers({ mainPlayer, opponentPlayer });

    // gameMenuView.startGameAndHideMenu({
    //   firstMovePlayer: "P1",
    // });
  });

  room.onMessage("busyPlayers", (players) => {
    if (players <= 1) return;

    lobbyView.updateBusyPlayers(players);
    // update players count on lobbyView
  });
};
