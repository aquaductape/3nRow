import * as state from "./state";
import * as player from "./actions/player";
import * as move from "./actions/move";
import * as room from "./actions/room";

export default { ...state, ...player, ...move, ...room };
