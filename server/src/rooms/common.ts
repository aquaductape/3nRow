import { Room, Delayed, Client } from "colyseus";
import { type, Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import _RoomReadibleId from "../RoomReadibleId";
import {
  TOnMove,
  TOnSkinChange,
  TMovePosition,
  TPickSkin,
  TRoomCode,
  TReadyPlayersResult,
} from "../../../src/app/ts/colyseusTypes";
import { getByValue, capitalize } from "../utils";

const BOARD_WIDTH = 3;
const RoomReadibleId = new _RoomReadibleId();
let busyPublicPlayersCount = 0;

class Move extends Schema {
  @type("number") column: number = 0;
  @type("number") row: number = 0;
}

class Player extends Schema {
  @type("string") playerId: string;
  @type("boolean") ready = false;
}

const getRandomPlayerId = (arr: string[]) => {
  if (arr.length === 1) return arr[0];
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
};

const playerIds = ["P1", "P2"];

class State extends Schema {
  @type("boolean") isGameOver = false;
  @type("boolean") ready = false;
  @type("boolean") gameStarted = false;
  @type("string") firstMovePlayer = "P1";
  @type("string") firstMove: "alternate" | "winner" | "loser" = "alternate";
  @type("string") winner = "";
  @type("string") loser = "";
  @type("string") currentTurn = "P1";
  @type(["number"]) board: number[] = new ArraySchema<number>(
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  );
  @type({ map: "string" }) shapes = new MapSchema<string>({
    cross: "",
    circle: "",
    triangle: "",
    heart: "",
  });
  @type({ map: "string" }) colors = new MapSchema<string>({
    "sky_blue,cyan": "",
    "green,yellow": "",
    "red,orange": "",
    "magenta,pink": "",
    "purple,blue": "",
    "white,grey": "",
  });
  @type(Move) move: Move = new Move();
  @type("string") claimedColorFirst = "";
  @type("string") claimedShapeFirst = "";
  @type(["string"]) playerIdsSlots = new ArraySchema<string>(...playerIds);
  @type("boolean") bothPickedSkins = false;
}
// Pre-game TIMELINE
//
// FindPlayers
//  find-players
//  *opponent joins*
// ReadyPlayers
//  pick skins
//    color
//    shape
// PreparePlayers
// Declare Match
//  who's who, and who goes first
// Start Game

export class Common extends Room<State> {
  roomReadibleId = "";
  maxClients = 2;
  randomMoveTimeout: Delayed;
  players = new Map<string, { playerId: string; ready: boolean }>();
  public delayedInterval!: Delayed;

  onCreate(options: { isPrivate: boolean }) {
    if (options.isPrivate) {
      this.roomReadibleId = RoomReadibleId.incrementId();
    }

    this.setState(new State());

    this.onMessage<TMovePosition>("move", (client, message) => {
      return this.playerMove(client, message);
    });
    this.onMessage<TOnSkinChange>("skinChange", (client, message) => {});
    this.onMessage<TPickSkin>("pickSkin", (client, message) => {
      this.playerPickSkinDuringCountdown(client, message);
    });
    this.onMessage<any>("votePlayAgain", (client, msg) => {
      this.votePlayAgain(client);
    });
    this.onMessage<any>("playAgainNow", (client, msg) => {
      this.playAgainNow(client);
    });
    this.onMessage<boolean>("prepareGame", (client, msg) => {
      // setTimeout(() => {
      this.declarePlayers();
      // }, 5000);
    });
  }
  // request

  onJoin(client: Client, options: { password: string; isPrivate: boolean }) {
    const setPlayers = () => {
      this.players.set(client.sessionId, {
        playerId: getRandomPlayerId(this.state.playerIdsSlots),
        // playerId: this.state.playerIdsSlots.pop(),
        ready: false,
      });
    };

    if (options.password && typeof options.password !== "boolean") {
      if (options.password === this.roomReadibleId) {
        setPlayers();
        this.readyGame();
      }
      return;
    }

    if (options.isPrivate) {
      setPlayers();
      // this.internalState

      // @ts-ignore
      this.listing.password = this.roomReadibleId;
      client.send("roomCode", this.roomReadibleId);
      return;
    }

    setPlayers();

    busyPublicPlayersCount++;
    this.broadcast("busyPlayers", busyPublicPlayersCount - 1);

    if (this.players.size === 2) {
      this.readyGame();
    }
  }

  playAgainNow(client: Client) {
    this.playAgain(client);
  }

  votePlayAgain(client: Client) {
    if (!this.state.isGameOver) return;

    const player = this.players.get(client.sessionId);
    player.ready = true;
    const readyArr: boolean[] = [];

    for (const [_, { ready }] of this.players) {
      readyArr.push(ready);
    }
    if (readyArr.every((ready) => ready)) {
      this.playAgain(client);
    }
  }

  playAgain(client: Client) {
    if (!this.state.isGameOver) return;

    this.resetGame();
    this.broadcast(
      "playAgain",
      {
        firstMovePlayer: this.state.firstMovePlayer,
      },
      { except: client }
    );
  }

  onLeave(client: Client) {
    this.players.delete(client.sessionId);
    busyPublicPlayersCount--;
    this.stopClock();

    this.broadcast("opponentLeft", true);
  }

  readyGame() {
    // lock this room for new users
    this.lock();
    // this.broadcast("readyPlayers", this.state.players, {});
    this.clients.forEach((client, idx) => {
      const result: TReadyPlayersResult = {
        id: this.players.get(client.id).playerId,
        isHost: idx === 0,
        roomType: this.roomName as any,
      };
      client.send("readyPlayers", result);
    });

    // this.send(this.clients[0], 'msgType', msg)
    // client.send('type', msg, { // ??? })
    // this.send(, )
    // this.send(, 'readyPlayers', {})
    // this.clients[0];

    // this.startClock();
    this.startPickSkinCountdown();
  }

  endCountdown() {
    this.broadcast("endCountdown", true);
  }

  declarePlayers() {
    const pickRandomSkinForLatePlayers = () => {
      playerIds.forEach((playerId) => {
        const skins = ["colors", "shapes"];
        skins.forEach((skin) => {
          // @ts-ignore
          const existingValue = (getByValue(
            // @ts-ignore
            this.state[skin],
            playerId
          ) as unknown) as string;
          if (existingValue) return;
          // @ts-ignore
          const arr = (Array.from(this.state[skin]) as unknown) as [
            [string, string]
          ];
          const filtered = arr.filter(([_, value]) => !value);
          const randomKey =
            filtered[Math.floor(Math.random() * filtered.length)][0];
          // @ts-ignore
          this.state[skin].set(randomKey, playerId);
        });
      });
    };

    if (!this.state.bothPickedSkins) {
      pickRandomSkinForLatePlayers();
    }

    if (this.state.gameStarted) return;

    this.state.gameStarted = true;
    this.broadcast("declarePlayers", {
      P1: {
        color: getByValue(this.state.colors, "P1"),
        shape: getByValue(this.state.shapes, "P1"),
      },
      P2: {
        color: getByValue(this.state.colors, "P2"),
        shape: getByValue(this.state.shapes, "P2"),
      },
    });
  }

  startPickSkinCountdown() {
    const time = 17_000;
    let counter = 16;
    // let counter = 0;
    this.startClock({
      time,
      onInterval: (ref) => {
        if (counter >= 0) {
          counter--;
          const counterDisplay = counter <= 15 ? counter : 15;
          this.broadcast("countDownPickSkin", counterDisplay);
        }
      },
      // onEnd: () => {
      //   // console.log({ alreadyEnded });
      //   if (!alreadyEnded) {
      //     this.broadcast("countDownPickSkin", 0);
      //   }
      // },
    });
  }

  startPlayAgainCountdown() {
    const time = 10_000;
    this.startClock({
      time,
      onEnd: () => {
        // this.playAgain();
      },
    });
  }

  startPlayerTurnCountDown() {
    const time = 80_000;

    this.startClock({
      time,
    });
  }

  startClock({
    onInterval,
    onEnd,
    time,
  }: {
    /**milliseconds */
    time: number;
    onInterval?: (props: { counter: number }) => void;
    onEnd?: Function;
  }) {
    const ref = {
      counter: time,
    };
    this.clock.start();
    // Set an interval and store a reference to it
    // so that we may clear it later

    if (onInterval) {
      this.delayedInterval = this.clock.setInterval(() => {
        onInterval(ref);
      }, 1000);
    }

    // After 15 seconds clear the timeout;
    // this will *stop and destroy* the timeout completely
    this.clock.setTimeout(() => {
      this.delayedInterval.clear();
      ref.counter = time;
      this.stopClock();
      onEnd && onEnd();
      // this.endCountdown();
    }, time);
  }

  stopClock() {
    this.clock.stop();
    this.delayedInterval.clear();
  }

  playerSkinChange(client: Client, message: string) {}

  playerPickSkin({
    type,
    playerId,
    value,
  }: {
    type: string;
    playerId: string;
    value: string;
  }) {
    // @ts-ignore
    const skin = this.state[type + "s"] as MapSchema<string>;
    // @ts-ignore
    const prevItem = getByValue(skin, playerId);
    const currentItem = skin.get(value);

    if (currentItem && currentItem !== playerId) return;

    if (!prevItem) {
      skin.set(value, playerId);
      return;
    }
    skin.set(prevItem, "");
    skin.set(value, playerId);
  }

  alreadyPicked({
    playerId,
    type,
    value,
  }: {
    type: string;
    playerId: string;
    value: string;
  }) {
    // @ts-ignore
    const skin = this.state[type + "s"] as MapSchema<string>;
    // @ts-ignore
    const currentItem = skin.get(value);

    return currentItem && currentItem !== playerId;
  }

  playerPickSkinDuringCountdown(client: Client, message: TPickSkin) {
    const { value, playerId, type } = message;
    const skin = { type, value };
    const claimedFirstItemProp = `claimed${capitalize(type)}First`;
    let claimedFirst = false;
    let success = true;

    // @ts-ignore
    if (!this.state[claimedFirstItemProp]) {
      // @ts-ignore
      this.state[claimedFirstItemProp] = playerId;
      claimedFirst = true;
    }

    // item was already picked by another player
    // no need to send error, earlier broadcast sent by other player will arrive earlier
    if (this.alreadyPicked({ type, playerId, value })) return;

    this.playerPickSkin({ type, playerId, value });

    // both players picked all skins before countdown
    if (
      playerIds.every((playerId) => {
        const hasColorItem = getByValue(this.state.colors, playerId);
        const hasShapeItem = getByValue(this.state.shapes, playerId);
        return hasColorItem && hasShapeItem;
      })
    ) {
      this.stopClock();
      this.declarePlayers();
      this.state.bothPickedSkins = true;
    }

    // no need to broadcast data back to late client, already done by previous broadcast
    if (type === "color") {
      if (this.state.claimedColorFirst !== playerId) return;
    } else {
      if (this.state.claimedShapeFirst !== playerId) return;
    }

    this.broadcast("pickSkin", {
      success: true,
      skin,
      finishedFirst: claimedFirst,
      playerId,
    });
  }

  isMoveValid(playerId: string, message: TMovePosition) {
    try {
      const isPosValid = (pos: number) => {
        return pos >= 0 && pos <= 2;
      };
      const index = message.column + BOARD_WIDTH * message.row;

      if (this.state.currentTurn !== playerId) return false;

      if (!isPosValid(message.column) || !isPosValid(message.row)) return false;

      if (this.state.board[index] !== 0) return false;
    } catch (err) {
      return false;
    }
    return true;
  }

  playerMove(client: Client, message: TMovePosition) {
    if (!this.state.gameStarted || this.state.isGameOver) return;

    const playerId = this.players.get(client.sessionId).playerId;
    if (!this.isMoveValid(playerId, message)) {
      this.doRandomMove({ client, playerId });
      return;
    }

    this.fillCell({ playerId, ...message });

    if (
      this.checkWin({ ...message, playerId: playerId === "P1" ? 1 : 2 }) ||
      this.isBoardComplete()
    ) {
      this.gameOver();
    }

    this.state.currentTurn = this.getOppositePlayer({ playerId });

    this.broadcast("move", message, { except: client });
  }

  gameOver() {
    this.state.firstMovePlayer = this.getOppositePlayer({
      playerId: this.state.firstMovePlayer,
    });
    this.state.isGameOver = true;
  }

  isBoardComplete() {
    return this.state.board.filter((item) => item === 0).length === 0;
  }

  resetGame() {
    this.state.isGameOver = false;
    this.state.currentTurn = this.state.firstMovePlayer;
    this.state.board = new ArraySchema(0, 0, 0, 0, 0, 0, 0, 0, 0);
  }

  fillCell({
    column,
    row,
    playerId,
  }: {
    playerId: string;
    column: number;
    row: number;
  }) {
    const index = column + BOARD_WIDTH * row;
    if (this.state.board[index] !== 0) return;
    this.state.board[index] = playerId === "P1" ? 1 : 2;
  }

  doRandomMove({ client, playerId }: { playerId: string; client: Client }) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_WIDTH; y++) {
        const index = x + BOARD_WIDTH * y;

        this.fillCell({ playerId, column: x, row: y });
        this.broadcast("move", { row: x, column: y }, { except: client });

        if (
          this.checkWin({
            row: y,
            column: x,
            playerId: playerId === "P1" ? 1 : 2,
          })
        ) {
          this.gameOver();
          return;
        }

        return;
      }
    }
  }

  checkWin({
    playerId,
    column,
    row,
  }: {
    row: number;
    column: number;
    playerId: number;
  }) {
    let won = false;
    let board = this.state.board;

    // horizontal
    for (let y = 0; y < BOARD_WIDTH; y++) {
      const i = column + BOARD_WIDTH * y;
      if (board[i] !== playerId) break;
      if (y == BOARD_WIDTH - 1) {
        won = true;
      }
    }

    // vertical
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const i = x + BOARD_WIDTH * row;
      if (board[i] !== playerId) break;
      if (x == BOARD_WIDTH - 1) {
        won = true;
      }
    }

    // cross forward
    if (row === column) {
      for (let xy = 0; xy < BOARD_WIDTH; xy++) {
        const i = xy + BOARD_WIDTH * xy;
        if (board[i] !== playerId) break;
        if (xy == BOARD_WIDTH - 1) {
          won = true;
        }
      }
    }

    // cross backward
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const y = BOARD_WIDTH - 1 - x;
      const i = x + BOARD_WIDTH * y;
      if (board[i] !== playerId) break;
      if (x == BOARD_WIDTH - 1) {
        won = true;
      }
    }

    return won;
  }

  getOppositePlayer({
    sessionId,
    playerId,
  }: {
    playerId?: string;
    sessionId?: string;
  }) {
    for (let [a_sessionId, { playerId: a_playerId }] of this.players) {
      if (sessionId && sessionId !== a_sessionId) {
        return a_playerId;
      }
      if (playerId && playerId !== a_playerId) {
        return a_playerId;
      }
    }
    return null;
  }
}
