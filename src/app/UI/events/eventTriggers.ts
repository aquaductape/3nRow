import { IeventListenerOrder } from "../../../models/index";

export const eventListenerOrder: IeventListenerOrder = {
  player1BtnOptions: false,
  player2BtnOptions: false,
  dropDownDifficulty: false
};
export const otherEventsTriggered = () => {
  const {
    player1BtnOptions,
    player2BtnOptions,
    dropDownDifficulty
  } = eventListenerOrder;
  return player1BtnOptions || player2BtnOptions || dropDownDifficulty;
};

export const isTriggeredPlayerBtnOptions = () => {
  const { player1BtnOptions, player2BtnOptions } = eventListenerOrder;

  return player1BtnOptions || player2BtnOptions;
};

export const isTriggeredDifficultyDD = () => {
  const { dropDownDifficulty } = eventListenerOrder;
  return dropDownDifficulty;
};

export const resetOtherEventsTriggered = () => {
  for (let key in eventListenerOrder) {
    eventListenerOrder[key] = false;
  }
};
