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

export const setRoomCodeFromUrlParams = () => {
  const params = new URLSearchParams(location.search.slice(1));
  state.onlineMultiplayer.roomCode = params.get("code");
};

const resetMultiplayer = () => {
  state.onlineMultiplayer.room = null;
  state.onlineMultiplayer.pickedItems = { color: "", shape: "" };
  state.onlineMultiplayer.hasPickedSkin = false;
};
