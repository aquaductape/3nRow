import model from "../model/model";
import boardView from "../views/board/boardView";
import gameContainerView from "../views/gameContainer/gameContainerView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import gameMenuView from "../views/gameMenu/gameMenuView";
import { buildShapesForPlayers } from "../views/svg/shapes";
import svgDefsView from "../views/svg/svgDefsView";
import settingsView from "../views/settings/settingsView";
import skipToGameMenu from "../views/skipContentBtn/skipToGameMenuView";
import { controlSettings } from "./settings";
import { moveAi, movePlayer } from "./move";
import { controlPlayerColor, controlPlayerShape } from "./playerOptions";
import { controlPlayAgain, controlStartGame } from "./menu";

export const init = () => {
  localStorage.clear();

  // model
  model.updateStateFromLS();
  model.setShapes(buildShapesForPlayers(model.state.players));

  // render views
  svgDefsView.render(model.state.players);
  playerBtnGroupView.render(model.state);
  boardView.render(model.state);
  gameMenuView.render(model.state.players);
  skipToGameMenu.render();
  settingsView.render(model.state);
  // messageView.render("Player 1 has Won!");

  // add handlers
  playerBtnGroupView.addHandlers({
    handlerChangeColor: controlPlayerColor,
    handlerChangeShape: controlPlayerShape,
  });
  gameMenuView.addHandlers({
    handlerStartGame: controlStartGame,
    handlerPlayAgain: controlPlayAgain,
    handlerSettings: controlSettings,
  });
  settingsView.addHandlers({
    handlerSettings: controlSettings,
    handlerMoveAi: moveAi,
  });
  boardView.addHandlerCell(movePlayer);
  // run DOM events
  gameContainerView.runResizeListener();
  gameContainerView.revealAfterPageLoad();
};
