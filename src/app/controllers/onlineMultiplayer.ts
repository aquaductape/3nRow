import { getOppositePlayer } from "../model/actions/player";
import model from "../model/model";
import { TRoomClient } from "../ts/colyseusTypes";
import boardView from "../views/board/boardView";
import gameMenuView from "../views/gameMenu/gameMenuView";
import createPrivateGameView from "../views/lobby/createPrivateGameView";
import joinPrivateGameView from "../views/lobby/joinPrivateGameView";
import lobbyView from "../views/lobby/lobbyView";
import preGameView from "../views/lobby/preGameView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import svgDefsView from "../views/svg/svgDefsView";
import { delayP } from "../views/utils/animation";
import { controlMovePlayer } from "./move";
import { controlPlayerColor, controlPlayerShape } from "./playerOptions";

// I think it's appropriate to place the multiplayer websocket listeners as Controller
// since ultimately the server that initiates action, was caused by a user on the other end

export type TControlJoinRoom = (props: {
  type: "private" | "public";
  password?: string;
}) => void;
export const controlJoinRoom: TControlJoinRoom = async ({ type, password }) => {
  try {
    const Colyseus = await import(
      /* webpackChunkName: "colyseus" */ "colyseus.js"
    );
    const client = new Colyseus.Client(model.state.onlineMultiplayer.serverWS);
    let room = (null as unknown) as TRoomClient;

    if (type === "public") {
      room = (await client.joinOrCreate(type)) as TRoomClient;
    }

    if (type === "private") {
      room = (await client.join(type, {
        password,
      })) as TRoomClient;
    }

    model.setRoom(room);
    roomActions({ room });

    if (type === "private") {
      return;
    }

    preGameView.transitionPreGameStage({ type: "find-players" });
  } catch (err) {
    console.error(err);
    if (type === "private") {
      const errMsg = (err = "no rooms found with provided criteria"
        ? "Room doesn't exist"
        : "Server Error");
      joinPrivateGameView.setData({ isLocating: false });
      // With what I built, running new animation on an already transitioning animation is very fragile and broken,
      setTimeout(() => {
        joinPrivateGameView.displayRoomError(errMsg);
        joinPrivateGameView.displaySubmitArea({ type: "join-btn" });
      }, 500);
      return;
    }
  }
};

export type TControlCreateRoom = () => void;
export const controlCreateRoom: TControlCreateRoom = async () => {
  try {
    const Colyseus = await import(
      /* webpackChunkName: "colyseus" */ "colyseus.js"
    );
    const client = new Colyseus.Client(
      `ws://${process.env.MULTIPLAYER_ENDPOINT || "localhost:3000"}`
    );

    const room = (await client.create("private", {
      isPrivate: true,
    })) as TRoomClient;

    model.setRoom(room);
    roomActions({ room });
  } catch (err) {}
};

export type TControlExitMultiplayer = () => void;
export const controlExitMultiplayer: TControlExitMultiplayer = () => {
  const { room } = model.state.onlineMultiplayer;
  if (!room) return;

  room.leave();
  model.exitMultiplayer();
};

const roomActions = ({ room }: { room: TRoomClient }) => {
  room.onMessage("roomCode", (roomCode) => {
    createPrivateGameView.setData({ roomCode });
    createPrivateGameView.transitionStages({ type: "room-created" });
  });

  room.onMessage("move", ({ column, row }) => {
    if (model.state.game.gameOver) {
      let timeout = 1500;

      if (document.visibilityState === "visible") {
        controlMovePlayer({ column, row, userActionFromServer: true });
        return;
      }

      document.addEventListener("visibilitychange", function onVisible() {
        if (document.visibilityState === "visible") {
          setTimeout(() => {
            controlMovePlayer({ column, row, userActionFromServer: true });
          }, timeout);
          document.removeEventListener("visibilitychange", onVisible);
        }
      });
    } else {
      controlMovePlayer({ column, row, userActionFromServer: true });
    }
  });

  room.onMessage("playAgain", ({ firstMovePlayer }) => {
    let timeout = 1000;

    if (document.visibilityState === "visible") {
      gameMenuView.playAgainAndHideMenu();
      return;
    }

    document.addEventListener("visibilitychange", function onVisible() {
      if (document.visibilityState === "visible") {
        setTimeout(() => {
          gameMenuView.playAgainAndHideMenu();
        }, timeout);
        document.removeEventListener("visibilitychange", onVisible);
      }
    });
  });

  room.onMessage(
    "pickSkinPreGame",
    ({ success, skin, finishedFirst, playerId }) => {
      // console.log("onpickskin", playerId, skin);
      const player = model.getPlayerById(playerId)!;

      const mainPlayerClaim = () => {
        // if (!success) {
        //   preGameView.failedPick({ type: skin.type, value: skin.value });
        //   return;
        // }

        if (skin.type === "color") {
          // console.log( "mainPlayerClaim: ", playerId, model.getPlayerById(playerId));
          model.setPlayerCurrentColor({ player, color: skin.value });
          svgDefsView.updateShapeColors(model.state.players);
          lobbyView.setData({ mainPlayer: model.getPlayerById(playerId) });
          preGameView.transitionPickSkin({ type: "shape" });
          return;
        }

        if (skin.type === "shape") {
          if (finishedFirst) {
            preGameView.transitionPreGameStage({ type: "wait-for-opponent" });
          } else {
            preGameView.transitionPreGameStage({ type: "preparing-game" });
          }
        }
      };

      const opponentPlayerClaim = () => {
        // if picked item is not the same as client picked
        const { pickedItems } = model.state.onlineMultiplayer;

        if (pickedItems[skin.type]) {
          if (pickedItems[skin.type] === skin.value) {
            preGameView.failedPick({ type: skin.type, value: skin.value });
          } else {
            // client picked item will not conflict other player, go ahead and transition to next stage
            if (skin.type === "color") {
              model.setPlayerCurrentColor({
                player: getOppositePlayer(playerId),
                color: pickedItems[skin.type],
              });
              svgDefsView.updateShapeColors(model.state.players);
              lobbyView.setData({
                mainPlayer: getOppositePlayer(playerId),
              });

              preGameView.transitionPickSkin({ type: "shape" });
              return;
            }

            if (skin.type === "shape") {
              preGameView.transitionPreGameStage({
                type: "preparing-game",
              });
            }
          }
        }

        preGameView.showOpponentClaimedPick({
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
    }
  );

  room.onMessage("countDownPickSkin", (counter) => {
    if (!preGameView.hasRendered) return;
    preGameView.updateCountDown(counter);
    if (counter === 0) {
      room.send("prepareGame", true);
      preGameView.transitionPreGameStage({ type: "preparing-game" });
    }
  });

  room.onMessage("readyPlayers", async (result) => {
    const { id, isHost, roomType } = result;
    const mainPlayerId = id;
    const opponentPlayerId = id === "P1" ? "P2" : "P1";

    model.setMultiplayerPlayers({
      mainPlayer: mainPlayerId,
      opponentPlayer: opponentPlayerId,
    });

    resetPlayers();

    lobbyView.setData({
      players: model.state.players,
      mainPlayer: model.getPlayerById(mainPlayerId),
    });
    preGameView.setData({
      joinBy: "public",
      players: model.state.players,
      mainPlayer: model.getPlayerById(mainPlayerId),
    });

    if (roomType === "private") {
      if (isHost) {
        preGameView.setData({
          joinBy: "created-private",
        });
      } else {
        preGameView.setData({
          joinBy: "private",
        });
      }

      await lobbyView.transitionBetweenLobbyTypes({ type: "enter-pre-game" });
    }
    preGameView.transitionPreGameStage({ type: "found-players" });
    preGameView.transitionPreGameStage({ type: "pick-skins" });
    playerBtnGroupView.hideInnerBtn({
      selectors: ["playerMark", "playerOptionsIcon"],
    });
    playerBtnGroupView.disableBtns();
    playerBtnGroupView.updatePlayAgainst({ type: "multiplayer" });
    // must close already open dropdown
  });

  room.onMessage("declarePlayers", (players) => {
    if (!players) return;
    const mainPlayer = model.getPlayerById(
      model.state.onlineMultiplayer.mainPlayer
    )!;
    const opponentPlayer = model.getPlayerById(
      model.state.onlineMultiplayer.opponentPlayer
    )!;

    for (const playerId in players) {
      const { color, shape } = players[playerId];
      const player = model.getPlayerById(playerId)!;

      model.setPlayerCurrentColor({ color, player });
      model.setPlayerCurrentShape({ shape, player });
      playerBtnGroupView.updateSvgMark(player);
    }
    playerBtnGroupView.updateSkinSelectionInDropdown({
      player: mainPlayer,
      type: ["color", "shape"],
    });
    playerBtnGroupView.updateSkinDisabledInDropdown({
      id: mainPlayer.id,
      oppositePlayer: opponentPlayer,
      type: ["color", "shape"],
    });

    svgDefsView.updateShapeColors(model.state.players);
    lobbyView.hideAndRemoveCountDownMarkup({ duration: 50 });

    playerBtnGroupView.enableBtn(mainPlayer.id);
    playerBtnGroupView.showInnerBtn({
      playerId: mainPlayer.id,
      selectors: ["playerMark", "playerOptionsIcon"],
    });
    playerBtnGroupView.showInnerBtn({
      playerId: opponentPlayer.id,
      selectors: ["playerMark"],
    });
    playerBtnGroupView.disableBtn(opponentPlayer.id);
    lobbyView.setData({
      players: model.state.players,
      mainPlayer,
    });

    svgDefsView.updateDropShadow("rgba(0,0,0, 0.3)");
    gameMenuView.changeMenuTheme("menu");
    gameMenuView.hideBtnNavigationBack();
    preGameView.transitionPreGameStage({ type: "declare-players" });

    // TODO use promise
    setTimeout(() => {
      // lobbyView.removeEventListenersAndOtherUI();
      lobbyView.destroy();
      gameMenuView.startGameAndHideMenu({ firstMovePlayer: "P1" });
    }, 3300);
  });

  room.onMessage("busyPlayers", (players) => {
    if (players <= 1) return;

    preGameView.updateBusyPlayers(players);
    // update players count on lobbyView
  });

  room.onMessage("pickSkin", ({ playerId, skin, success }) => {
    const currentPlayer = model.getPlayerById(playerId)!;
    const oppositePlayer = model.getOppositePlayer(playerId);
    // playerBtnGroupView.
    if (!success) {
      console.log("unsuccessfull");
      if (skin.type === "color") {
        model.setPlayerCurrentColor({
          player: currentPlayer,
          color: skin.value,
        });
        model.setPlayerCurrentColor({
          player: oppositePlayer,
          color: skin.value,
        });
      }
      if (skin.type === "shape") {
        model.setPlayerCurrentShape({
          player: currentPlayer,
          shape: skin.value,
        });

        model.setPlayerCurrentShape({
          player: oppositePlayer,
          shape: skin.value,
        });
      }

      playerBtnGroupView.updateSkinSelectionInDropdown({
        player: currentPlayer,
        type: skin.type,
      });
      playerBtnGroupView.updateSkinDisabledInDropdown({
        id: oppositePlayer.id,
        oppositePlayer: currentPlayer,
        type: skin.type,
      });
      return;
    }
    console.log("success");

    if (skin.type === "color") {
      controlPlayerColor({
        player: currentPlayer,
        color: skin.value,
        userActionFromServer: true,
      });
    }
    if (skin.type === "shape") {
      controlPlayerShape({
        player: currentPlayer,
        shape: skin.value,
        userActionFromServer: true,
      });
    }
  });

  room.onMessage("opponentLeft", () => {
    if (preGameView.hasRendered) {
      gameMenuView.changeMenuTheme("lobby");
      preGameView.hideAndRemoveCountDownMarkup();
      preGameView.transitionPreGameStage({ type: "player-left" });

      setTimeout(() => {
        preGameView.transitionPreGameStage({ type: "find-players" });
      }, 1000);
      return;
    }

    const transitionTimeout = 800;
    // const mainPlayer = model.getPlayerById(
    //   model.state.onlineMultiplayer.mainPlayer
    // )!;
    const winnerPlayer = model.getWinner()!;
    const loserPlayer = model.getLoser()!;
    let player = winnerPlayer;
    let declare = "winner" as "winner" | "loser";

    model.runGameOver();
    boardView.preventPlayerToSelect();
    playerBtnGroupView.resetPlayerIndicators();

    //   if (!model.state.game.gameTie) {
    //     model.increaseWinnerScore();
    //     playerBtnGroupView.updatePlayerScore(winnerPlayer);
    //   }
    //
    //   if (model.state.game.hasAI && model.getAiPlayer() === winnerPlayer) {
    //     declare = "loser";
    //     player = loserPlayer;
    //   }
    //
    //   if (model.state.onlineMultiplayer.active && mainPlayer !== winnerPlayer) {
    //     declare = "loser";
    //     player = loserPlayer;
    //   }

    setTimeout(() => {
      gameMenuView.renderGameOverMenu({
        declare,
        player,
      });
      boardView.preGame();
      playerBtnGroupView.updatePlayerBtnsOnPreGame();
    }, transitionTimeout);
  });
};

const resetPlayers = () => {
  const { mainPlayer, opponentPlayer } = model.state.onlineMultiplayer;
  const playerIds = [mainPlayer, opponentPlayer];

  playerIds.forEach((playerId) => {
    const player = model.getPlayerById(playerId)!;
    model.setPlayerCurrentColor({ player, color: "" });
    model.setPlayerCurrentShape({ player, shape: "" });
  });
};
