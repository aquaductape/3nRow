import { dom } from "./dom";

export const addAntMenu = () => {
  const playerOptions = <NodeListOf<HTMLElement>>(
    document.querySelectorAll("." + dom.class.playerOptions)
  );

  playerOptions.forEach(option => (option.innerHTML = dom.svg.antMenu));
};
