import { dom } from "../../dom";
import { toggleDropDown } from "../../dropDown/dropDown";

export const controllerAiDifficulty = () => {
  const btnAi = <HTMLElement>document.querySelector("." + dom.class.btnAi);
  if (!btnAi) return null;
  btnAi.addEventListener("click", toggleDropDown);
};
