import { dom } from "../../dom";
import { cleanUp } from "../../board";
import { removeAllPlayerOptions } from "../playerOptions";
import { removeDropDown } from "../../dropDown/dropDown";

export const controllerRestart = () => {
  const restart = <HTMLElement>document.getElementById(dom.id.optionsRestart);
  restart.addEventListener("click", e => {
    cleanUp(e);
    removeAllPlayerOptions();
    removeDropDown();
  });
};
