import Colyseus from "../model/colyseus";
import model from "../model/model";
import { TRoomClient } from "../ts/colyseusTypes";
import gameMenuView from "../views/gameMenu/gameMenuView";
import lobbyView from "../views/lobby/lobbyView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import { controlMovePlayer } from "./move";

// I think it's appropriate to place the multiplayer websocket listeners as Controller
// since ultimately the server that initiates action, was caused by a user on the other end

export type TControlJoinRoom = (props: {
  type: "private" | "public";
  password?: string;
}) => void;
export const controlJoinRoom: TControlJoinRoom = ({ type, password }) => {
  const client = new Colyseus.Client("ws://localhost:3000");
  let room: TRoomClient;

  if (type === "public") {
    room = client.joinOrCreate(type).then((room) => {
      console.log("client sucess PUBLIC joined: ", room.sessionId);

      model.setRoom(room as any);
      roomActions({ room: room as any, type });

      lobbyView.transitionPreGameStage({ type: "find-players" });
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

        lobbyView.transitionPreGameStage({ type: "find-players" });
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

export type TControlExitMultiplayer = () => void;
export const controlExistMultiplayer: TControlExitMultiplayer = () => {
  const { room } = model.state.onlineMultiplayer;
  if (!room) return;

  room.leave();
  model.exitMultiplayer();
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

  room.state.listen("skinChange", (foo) => {
    // still allow ui to update without confirmation of the server
    // but source of truth is in server
    // worse case scenario: player skin visually, will not be synced, but listener from the server will correct it, so there will be a flash change
  });

  room.onMessage("pickSkin", ({ success, skin, finishedFirst, playerId }) => {
    console.log("onpickskin", playerId, skin);
    const mainPlayerClaim = () => {
      if (!success) {
        lobbyView.failedPick();
      }

      if (skin.type === "color") {
        lobbyView.transitionPickSkin({ type: "shape" });
        return;
      }

      if (skin.type === "shape") {
        if (finishedFirst) {
          lobbyView.transitionPreGameStage({ type: "wait-for-opponent" });
        } else {
          lobbyView.transitionPreGameStage({ type: "declare-players" });
        }
      }
      // set skin on model
    };

    const opponentPlayerClaim = () => {
      lobbyView.showOpponentClaimedPick({
        type: skin.type,
        item: skin.value,
        calledByServer: true,
      });
      // set skin on model
    };

    if (playerId === model.state.onlineMultiplayer.mainPlayer) {
      mainPlayerClaim();
    } else {
      opponentPlayerClaim();
    }
  });

  room.state.listen("declarePlayers", (result) => {
    if (result) lobbyView.transitionPreGameStage({ type: "declare-players" });
  });

  room.onMessage("countDownPickSkin", (counter) => {
    lobbyView.updateCountDown(counter);
  });

  room.onMessage("readyPlayers", (ids) => {
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

    lobbyView.setData({
      players: model.state.players,
      currentPlayer: model.getPlayerById(mainPlayer),
    });
    lobbyView.transitionPreGameStage({ type: "pick-skins" });
    playerBtnGroupView.hideSvgMarks();
  });

  room.onMessage("startGame", (start) => {
    if (!start) return;

    // gameMenuView.startGameAndHideMenu({
    //   firstMovePlayer: "P1",
    // });
  });

  room.onMessage("busyPlayers", (players) => {
    console.log("busy players: ", players);
    if (players <= 1) return;

    lobbyView.updateBusyPlayers(players);
    // update players count on lobbyView
  });
};
