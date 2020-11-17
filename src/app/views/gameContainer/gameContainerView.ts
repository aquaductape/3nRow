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

      const margin = 40;
      const padding = 60;
      let width = 0;

      width =
        browserInnerHeight - playerBtnGroup.clientHeight - margin - padding;

      if (browserInnerHeight > 800) {
        gameContainer.style.maxWidth = `${width - 200}px`;
        return;
      }
      gameContainer.style.maxWidth = `${width}px`;
    };

    // init height
    changeHeight();

    const debouncedChangeHeight = debounce(changeHeight, 100);
    window.addEventListener("resize", () => {
      debouncedChangeHeight();
    });
  }
}

export default new GameContainerView();
