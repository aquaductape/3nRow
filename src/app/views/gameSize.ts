import { dom } from "../views/dom";
import { debounce } from "../../utils/index";
import { withinViewPort, moveElement } from "../views/dropDown/dropDown";

const changeHeight = () => {
  const gameContainer = <HTMLDivElement>(
    document.querySelector("." + dom.class.gameContainer)
  );
  const playerBtnGroup = <HTMLDivElement>(
    gameContainer?.querySelector("." + dom.class.playerBtnGroup)
  );

  const browserInnerHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const margin = 20;
  const padding = 40;
  let width = 0;

  if (browserInnerHeight > 800) {
    width = 700;
    gameContainer.style.maxWidth = `${width}px`;
    return;
  }

  width = browserInnerHeight - playerBtnGroup.clientHeight - margin - padding;
  gameContainer.style.maxWidth = `${width}px`;
};

const dropDownPosition = () => {
  const dropDown = <HTMLElement>(
    document.querySelector("." + dom.class.dropDownDifficulty)
  );
  if (dropDown) {
    const isWithinView = withinViewPort(dropDown, 5);
    moveElement(dropDown, isWithinView ? "bottom" : "top");
  }
};

// init height
changeHeight();

const debounceDropDown = debounce(dropDownPosition, 200);
window.addEventListener("resize", () => {
  changeHeight();
  debounceDropDown();
});
