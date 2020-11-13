import { debounce } from "../utils/index";
import View from "../View";

class GameContainerView extends View {
  playerBtnGroup: HTMLElement;

  constructor() {
    super({ root: ".game-container" });
    this.playerBtnGroup = <HTMLDivElement>(
      this.parentEl?.querySelector(".player-btn-group")
    );
  }

  // overrides to do nothing
  render() {
    return;
  }

  runResizeListener() {
    const changeHeight = () => {
      const gameContainer = this.parentEl;
      const playerBtnGroup = this.playerBtnGroup;
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

      width =
        browserInnerHeight - playerBtnGroup.clientHeight - margin - padding;
      gameContainer.style.maxWidth = `${width}px`;
    };

    // init height
    changeHeight();

    const debouncedChangeHeight = debounce(changeHeight, 100);
    window.addEventListener("resize", () => {
      // debouncedChangeHeight();
      debouncedChangeHeight();
    });
  }
}

export default new GameContainerView();
