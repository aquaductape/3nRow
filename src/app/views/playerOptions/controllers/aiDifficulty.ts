import { dom } from "../../dom";
import { onDropDown } from "../../dropDown/dropDown";

export const controllerAiDifficulty = () => {
  const btnAi = <HTMLElement>document.querySelector("." + dom.class.btnAi);
  if (!btnAi) return null;
  btnAi.addEventListener("click", onDropDown);
  btnAi.addEventListener("keydown", onDropDown);
};
