import model from "../model/model";
import { TPlayer } from "../model/state";
import boardView from "../views/board/boardView";
import gameContainerView from "../views/gameContainer/gameContainerView";
import playerBtnGroupView from "../views/player/playerBtnGroupView";
import { buildShapesForPlayers } from "../views/svg/shapes";
import svgDefsView from "../views/svg/svgDefsView";

export type TControlBoardCell = ({}: { row: number; column: number }) => void;
const controlBoardCell: TControlBoardCell = ({ column, row }) => {
  console.log({ column, row });
};

export type TControlStartGame = ({}: { id: string; ai: boolean }) => void;
const controlStartGame: TControlStartGame = ({ ai, id }) => {
  model.startGame();
  // set specific player as human or ai
  // starting game is hardcoded as player 2 confirming whether it's a human or an ai
  model.setPlayerAsHumanOrAI({ id, ai });

  // player 1 goes first regardless
};

export type TControlPlayerShape = ({}: {
  player: TPlayer;
  shape: string;
}) => void;
const controlPlayerShape: TControlPlayerShape = ({ player, shape }) => {
  // Model
  // update player shape
  model.setPlayerCurrentShape({ player, shape });

  // View
  // update btn mark
  playerBtnGroupView.updateSvgMark(player.id);
  // update marks on board
};

export type TControlPlayerColor = ({}: {
  player: TPlayer;
  color: string;
}) => void;
const controlPlayerColor: TControlPlayerColor = ({ player, color }) => {
  // Model
  // update player shape
  model.setPlayerCurrentColor({ player, color });

  // View
  // update svgDefs
  svgDefsView.render(model.state.players);
};

const init = () => {
  // model
  model.setShapes(buildShapesForPlayers(model.state.players));

  // run DOM events
  gameContainerView.runResizeListener();

  // render views
  svgDefsView.render(model.state.players);
  playerBtnGroupView.render(model.state);
  boardView.render(model.state);

  // add handlers
  playerBtnGroupView.addHandlerChangeShape(controlPlayerShape);
  playerBtnGroupView.addHandlerChangeColor(controlPlayerColor);
  boardView.addHandlerStartGame(controlStartGame);
  boardView.addHandlerCell(controlBoardCell);
};

init();
