import { Room, Delayed, Client } from "colyseus";
import { type, Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import _HumanId from "../HumanId";
import {
  TOnMove,
  TOnSkinChange,
  TMovePosition,
  TPickSkin,
} from "../../../src/app/ts/colyseusTypes";
import { getByValue } from "../utils";

const HumanId = new _HumanId();
let busyPublicPlayersCount = 0;

class Move extends Schema {
  @type("number") column: number = 0;
  @type("number") row: number = 0;
}

const getRandomPlayerId = (arr: string[]) => {
  if (arr.length === 1) return arr[0];
  return arr.splice(Math.floor(Math.random() * arr.length), 1)[0];
};

const playerIds = ["P1", "P2"];

class State extends Schema {
  @type("number") foo: number;
  @type("boolean") ready = false;
  @type("string") currentTurn: string;
  @type({ map: "string" }) players = new MapSchema<string>();
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
  humanId = "";
  maxClients = 2;
  randomMoveTimeout: Delayed;
  public delayedInterval!: Delayed;

  onCreate(options: { password: string }) {
    if (options.password) {
      this.humanId = HumanId.id;
      HumanId.incrementId();
    }

    this.setState(new State());

    this.onMessage<TMovePosition>("move", (client, message) => {
      return this.playerMove(client, message);
    });
    this.onMessage<TOnSkinChange>("skinChange", (client, message) => {});
    this.onMessage<TPickSkin>("pickSkin", (client, message) => {
      this.playerPickSkin(client, message);
    });
    this.onMessage<boolean>("prepareGame", (client, msg) => {
      // setTimeout(() => {
      this.declarePlayers(client);
      // }, 5000);
    });
  }

  onJoin(client: Client, options: { password: string }) {
    this.state.players.set(
      client.sessionId,
      getRandomPlayerId(this.state.playerIdsSlots)
    );

    if (options.password) {
      if (options.password === this.humanId) this.readyGame();
      return;
    }

    busyPublicPlayersCount++;
    this.broadcast("busyPlayers", busyPublicPlayersCount - 1);

    // console.log("onJoin: ", client.sessionId);

    if (this.state.players.size === 2) {
      this.readyGame();
    }
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    busyPublicPlayersCount--;
    console.log("remove player");

    const remainingPlayerIds = Array.from(this.state.players.keys());
    if (remainingPlayerIds.length > 0) {
      // this.state.winner = remainingPlayerIds[0];
    }
  }

  readyGame() {
    // lock this room for new users
    this.lock();
    this.broadcast("readyPlayers", this.state.players);

    // this.startClock();
    this.startPickSkin();
  }

  endCountdown() {
    this.broadcast("endCountdown", true);
  }

  declarePlayers(client: Client) {
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
          // @ts-ignore
        });
      });
    };

    if (!this.state.bothPickedSkins) {
      pickRandomSkinForLatePlayers();
    }

    console.log("DECLARE!!!");
    this.broadcast("declarePlayers", {
      P1: {
        color: getByValue(this.state.colors, "P1"),
        shape: getByValue(this.state.shapes, "P1"),
      },
      P2: {
        color: getByValue(this.state.colors, "P2"),
        shape: getByValue(this.state.shapes, "P2"),
      },
    }); // send skins as well
    // client.send("declarePlayers", {
    //   P1: {
    //     color: getByValue(this.state.colors, "P1"),
    //     shape: getByValue(this.state.shapes, "P1"),
    //   },
    //   P2: {
    //     color: getByValue(this.state.colors, "P2"),
    //     shape: getByValue(this.state.shapes, "P2"),
    //   },
    // });
  }

  startPickSkin() {
    this.startClock();
  }

  startClock() {
    const time = 15;
    let counter = time;
    this.clock.start();
    // Set an interval and store a reference to it
    // so that we may clear it later
    this.delayedInterval = this.clock.setInterval(() => {
      if (counter >= 0) this.broadcast("countDownPickSkin", --counter);
    }, 1000);

    // After 15 seconds clear the timeout;
    // this will *stop and destroy* the timeout completely
    this.clock.setTimeout(() => {
      this.delayedInterval.clear();
      counter = time;
      // this.endCountdown();
    }, (time + 1) * 1000);
  }

  stopClock() {
    this.clock.stop();
    this.delayedInterval.clear();
  }

  playerSkinChange(client: Client, message: string) {}

  playerPickSkin(client: Client, message: TPickSkin) {
    const { value, playerId, type } = message;
    const skin = { type, value };
    let claimedFirst = false;
    let success = false;

    if (type === "color") {
      const prevColorItem = getByValue(this.state.colors, playerId);
      const currentColorItem = this.state.colors.get(value);

      if (currentColorItem && currentColorItem !== playerId) {
        // item was already picked by another player
        // no need to send error, earlier broadcast sent by other player will arrive earlier
        return;
      }

      if (!prevColorItem) {
        if (!this.state.claimedColorFirst) {
          this.state.claimedColorFirst = playerId;
          claimedFirst = true;
        }
        this.state.colors.set(value, playerId);
      }
      this.state.colors.set(prevColorItem, "");
      this.state.colors.set(value, playerId);
      success = true;
    }

    if (type === "shape") {
      const prevShapeItem = getByValue(this.state.shapes, playerId);
      const currentShapeItem = this.state.shapes.get(value);

      if (currentShapeItem && currentShapeItem !== playerId) {
        // item was already picked by another player
        // no need to send error, earlier broadcast sent by other player will arrive earlier
        return;
      }

      if (!prevShapeItem) {
        if (!this.state.claimedShapeFirst) {
          this.state.claimedShapeFirst = playerId;
          claimedFirst = true;
        }
        this.state.shapes.set(value, playerId);
      }
      this.state.shapes.set(prevShapeItem, "");
      this.state.shapes.set(value, playerId);
      success = true;
    }

    // both players picked all skins before countdown
    if (
      playerIds.every((playerId) => {
        const hasColorItem = getByValue(this.state.colors, playerId);
        const hasShapeItem = getByValue(this.state.shapes, playerId);
        console.log(playerId, { hasColorItem, hasShapeItem });
        return hasColorItem && hasShapeItem;
      })
    ) {
      console.log("STOP clock");
      this.stopClock();
      this.declarePlayers(client);
      this.state.bothPickedSkins = true;
    }

    // no need to broadcast data back to late client, already done by previous broadcast
    if (type === "color") {
      if (this.state.claimedColorFirst !== playerId) return;
    } else {
      if (this.state.claimedShapeFirst !== playerId) return;
    }

    this.broadcast("pickSkin", {
      success,
      skin,
      finishedFirst: claimedFirst,
      playerId,
    });
  }

  playerMove(client: Client, message: TMovePosition) {
    // console.log("sessionId: ", client.sessionId, "id: ", client.id);
    // const oppositePlayer = Array.from(this.state.players).filter(
    //   (arr) => arr[0] !== client.sessionId
    // )[0][0];
    // client.send(oppositePlayer, message);
    // this.state.move.column = message.column;
    // this.state.move.row = message.row;
    // console.log(this.state.move.column, this.state.move.row);
    this.broadcast("move", message, { except: client });
    console.log("server playerMove", message);
    return "";
  }
}
