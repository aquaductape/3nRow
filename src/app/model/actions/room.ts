import { TRoomClient } from "../../ts/colyseusTypes";
import { state } from "../state";

export const setRoom = (room: TRoomClient) => {
  state.onlineMultiplayer.active = true;
  state.onlineMultiplayer.room = room;
};

export const exitMultiplayer = () => {
  state.onlineMultiplayer.active = false;
  resetMultiplayer();
};

const resetMultiplayer = () => {
  state.onlineMultiplayer.room = null;
  state.onlineMultiplayer.pickedItems = { color: "", shape: "" };
};
