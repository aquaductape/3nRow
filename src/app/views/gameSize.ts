import { dom } from "../views/dom";
import { debounce } from "../../utils/index";
import { withinViewPort, moveElement } from "../views/dropDown/dropDown";

const changeHeight = () => {
  const gameContainer = <HTMLDivElement | null>(
    document.querySelector("." + dom.class.gameContainer)
  );
  if (!gameContainer) return null;
  const browserInnerHeight =
    window.innerHeight || document.documentElement.clientHeight;

  if (browserInnerHeight < 600) {
    gameContainer.style.maxWidth = `${browserInnerHeight - 200}px`;
  } else if (browserInnerHeight < 900) {
    gameContainer.style.maxWidth = `${browserInnerHeight - 250}px`;
  } else if (browserInnerHeight < 1900) {
    gameContainer.style.maxWidth = `${browserInnerHeight - 300}px`;
  }
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
