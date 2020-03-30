import { dom } from "../../dom";
import { cleanUp } from "../../board";

export const controllerRestart = () => {
  const restart = <HTMLElement>document.getElementById(dom.id.optionsRestart);
  restart.addEventListener("click", e => {
    cleanUp(e);
  });
};
