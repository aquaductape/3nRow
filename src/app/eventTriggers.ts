import { IeventListenerOrder } from "../models/index";

export const eventListenerOrder: IeventListenerOrder = {
  player1BtnOptions: "",
  player2BtnOptions: "",
  dropDown: ""
};
export const otherEventsTriggered = () => {
  const { player1BtnOptions, player2BtnOptions, dropDown } = eventListenerOrder;
  return player1BtnOptions || player2BtnOptions || dropDown;
};

export const resetOtherEventsTriggered = () => {
  for (let key in eventListenerOrder) {
    eventListenerOrder[key] = "";
  }
};
