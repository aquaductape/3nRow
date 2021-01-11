import { getOppositePlayer } from "../model/actions/player";
import Colyseus from "../model/colyseus";
import model from "../model/model";
import { TRoomClient } from "../ts/colyseusTypes";
import gameMenuView from "../views/gameMenu/gameMenuView";
import lobbyView from "../views/lobby/lobbyView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import svgDefsView from "../views/svg/svgDefsView";
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

  // late pick
  room.onMessage("pickSkin", ({ success, skin, finishedFirst, playerId }) => {
    console.log("onpickskin", playerId, skin);
    const player = model.getPlayerById(playerId)!;

    const mainPlayerClaim = () => {
      if (!success) {
        lobbyView.failedPick({ type: skin.type, value: skin.value });
        return;
      }

      if (skin.type === "color") {
        console.log(
          "mainPlayerClaim: ",
          playerId,
          model.getPlayerById(playerId)
        );
        model.setPlayerCurrentColor({ player, color: skin.value });
        svgDefsView.updateShapeColors(model.state.players);
        lobbyView.setData({ mainPlayer: model.getPlayerById(playerId) });
        lobbyView.transitionPickSkin({ type: "shape" });
        return;
      }

      if (skin.type === "shape") {
        if (finishedFirst) {
          lobbyView.transitionPreGameStage({ type: "wait-for-opponent" });
        } else {
          lobbyView.transitionPreGameStage({ type: "preparing-game" });
        }
      }
    };

    const opponentPlayerClaim = () => {
      // if picked item is not the same as client picked
      const { pickedItems } = model.state.onlineMultiplayer;

      if (pickedItems[skin.type]) {
        if (pickedItems[skin.type] === skin.value) {
          lobbyView.failedPick({ type: skin.type, value: skin.value });
        } else {
          // client picked item will not conflict other player, go ahead and transition to next stage
          if (skin.type === "color") {
            model.setPlayerCurrentColor({
              player: getOppositePlayer({
                id: playerId,
                players: model.state.players,
              }),
              color: pickedItems[skin.type],
            });
            svgDefsView.updateShapeColors(model.state.players);
            lobbyView.setData({
              mainPlayer: getOppositePlayer({
                id: playerId,
                players: model.state.players,
              }),
            });

            lobbyView.transitionPickSkin({ type: "shape" });
            return;
          }

          if (skin.type === "shape") {
            lobbyView.transitionPreGameStage({
              type: "preparing-game",
            });
          }
        }
      }

      console.log("opponent already claimed");

      lobbyView.showOpponentClaimedPick({
        type: skin.type,
        item: skin.value,
      });
    };

    if (playerId === model.state.onlineMultiplayer.mainPlayer) {
      mainPlayerClaim();
    } else {
      opponentPlayerClaim();
    }

    if (skin.type === "color") {
      model.setPlayerCurrentColor({ player, color: skin.value });
    }

    if (skin.type === "shape") {
      model.setPlayerCurrentShape({ player, shape: skin.value });
    }
  });

  room.onMessage("countDownPickSkin", (counter) => {
    lobbyView.updateCountDown(counter);
    if (counter === 0) {
      room.send("prepareGame", true);
      lobbyView.transitionPreGameStage({ type: "preparing-game" });
    }
  });

  room.onMessage("readyPlayers", (ids) => {
    console.log("ready?", ids[room.sessionId]);
    let mainPlayer = "";
    let opponentPlayer = "";

    for (const id in ids) {
      const playerId = ids[id];
      const player = model.getPlayerById(playerId)!;

      model.setPlayerCurrentColor({ player, color: "" });
      model.setPlayerCurrentShape({ player, shape: "" });
      if (id === room.sessionId) {
        mainPlayer = playerId;
      } else {
        opponentPlayer = playerId;
      }
    }
    model.setMultiplayerPlayers({ mainPlayer, opponentPlayer });

    lobbyView.setData({
      players: model.state.players,
      mainPlayer: model.getPlayerById(mainPlayer),
    });
    lobbyView.transitionPreGameStage({ type: "pick-skins" });
    playerBtnGroupView.hideSvgMarks();
  });

  // pesky global variable
  let hasDeclaredPlayers = false;
  room.onMessage("declarePlayers", (players) => {
    console.log("declare-players");
    if (hasDeclaredPlayers) return;
    hasDeclaredPlayers = true;
    if (!players) return;
    const mainPlayer = model.getPlayerById(
      model.state.onlineMultiplayer.mainPlayer
    );

    for (const playerId in players) {
      const { color, shape } = players[playerId];
      const player = model.getPlayerById(playerId)!;
      console.log(player);

      model.setPlayerCurrentColor({ color, player });
      model.setPlayerCurrentShape({ shape, player });
      playerBtnGroupView.updateSvgMark(player);
    }

    svgDefsView.updateShapeColors(model.state.players);
    lobbyView.hideAndRemoveCountDownMarkup({ duration: 50 });
    playerBtnGroupView.showSvgMarks();
    lobbyView.setData({
      players: model.state.players,
      mainPlayer,
    });

    svgDefsView.updateDropShadow("rgba(0,0,0, 0.3)");
    gameMenuView.changeMenuTheme("menu");
    gameMenuView.hideBtnNavigationBack();
    lobbyView.transitionPreGameStage({ type: "declare-players" });
  });

  room.onMessage("busyPlayers", (players) => {
    console.log("busy players: ", players);
    if (players <= 1) return;

    lobbyView.updateBusyPlayers(players);
    // update players count on lobbyView
  });
};
