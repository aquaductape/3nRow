import { Room, Delayed, Client } from "colyseus";
import { type, Schema, MapSchema, ArraySchema } from "@colyseus/schema";

class State extends Schema {
  @type("string") currentTurn: string;
  @type({ map: "boolean" }) players = new MapSchema<boolean>();
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
  @type("string") winner: string;
  @type("boolean") draw: boolean;
}

export class TicTacToe extends Room<State> {
  maxClients = 2;
  randomMoveTimeout: Delayed;

  onCreate() {
    this.setState(new State());
    this.onMessage("action", (client, message) => {
      console.log("server: ", message);
      return this.playerAction(client, message);
    });
  }

  onJoin(client: Client) {
    this.state.players.set(client.sessionId, true);
    console.log("joined. player amount", this.state.players.size);

    if (this.state.players.size === 2) {
      console.log("locked room. player amount", this.state.players.size);
      this.state.currentTurn = client.sessionId;

      // lock this room for new users
      this.lock();
    }
  }

  playerAction(client: Client, message: string) {
    console.log(message);
    return "";
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);

    const remainingPlayerIds = Array.from(this.state.players.keys());
    if (remainingPlayerIds.length > 0) {
      this.state.winner = remainingPlayerIds[0];
    }
  }
}
