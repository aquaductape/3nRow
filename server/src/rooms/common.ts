import { Room, Delayed, Client } from "colyseus";
import { type, Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import _HumanId from "../HumanId";
import {
  TOnMove,
  TOnSkinChange,
  TMovePosition,
} from "../../../src/app/ts/colyseusTypes";

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
  @type("string") moveStr = "";
  @type(["string"]) playerIds = new ArraySchema<string>("P1", "P2");
}

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
    this.onMessage<string>("moveStr", (client, message) => {
      return this.playerMoveStr(client, message);
    });
    this.onMessage<TOnSkinChange>("skinChange", (client, message) => {});
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
  playerMoveStr(client: Client, message: string) {
    this.state.moveStr = message;
    console.log("server playerMoveStr", message);
    return "";
  }

  onJoin(client: Client, options: { password: string }) {
    this.state.players.set(
      client.sessionId,
      getRandomPlayerId(this.state.playerIds)
    );

    if (options.password) {
      if (options.password === this.humanId) this.startGame();
      return;
    }

    busyPublicPlayersCount++;
    this.broadcast("busyPlayers", busyPublicPlayersCount - 1);

    // console.log("onJoin: ", client.sessionId);

    if (this.state.players.size === 2) {
      this.startGame();
    }
  }

  startGame() {
    // lock this room for new users
    this.lock();
    this.broadcast("ready", this.state.players);

    this.startClock();
  }

  startClock() {
    this.clock.start();
    this.clock.currentTime;
    // Set an interval and store a reference to it
    // so that we may clear it later
    this.delayedInterval = this.clock.setInterval(() => {
      console.log("Time now " + this.clock.currentTime);
    }, 1000);

    // After 15 seconds clear the timeout;
    // this will *stop and destroy* the timeout completely
    this.clock.setTimeout(() => {
      this.delayedInterval.clear();
    }, 15_000);
  }

  playerSkinChange(client: Client, message: string) {}

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);
    busyPublicPlayersCount--;

    const remainingPlayerIds = Array.from(this.state.players.keys());
    if (remainingPlayerIds.length > 0) {
      // this.state.winner = remainingPlayerIds[0];
    }
  }
}
