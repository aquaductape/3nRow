import model from "../model/model";
import playerBtnGroupView from "../views/player/playerBtnGroupView";
import { buildShapesForPlayers } from "../views/svg/shapes";
import svgDefsView from "../views/svg/svgDefsView";

const controlPlayerShape = () => {
  console.log("hey");
};

const init = () => {
  // model
  model.setShapes(buildShapesForPlayers(model.state.players));

  // render views
  svgDefsView.render(model.state.players);
  playerBtnGroupView.render(model.state);

  // add handlers
  playerBtnGroupView.addHandlerChangeShape(controlPlayerShape);
};

init();
