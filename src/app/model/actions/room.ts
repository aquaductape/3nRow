import { TRoomClient } from "../../ts/colyseusTypes";
import { state } from "../state";

export const setRoom = (room: TRoomClient) => {
  state.onlineMultiplayer.active = true;
  state.onlineMultiplayer.room = room;
};
