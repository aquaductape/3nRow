import model from "../model/model";
import { TPlayer } from "../model/state";
import boardView from "../views/board/boardView";
import gameContainerView from "../views/gameContainer/gameContainerView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import menuView from "../views/menu/menuView";
import { buildShapesForPlayers } from "../views/svg/shapes";
import svgDefsView from "../views/svg/svgDefsView";
import messageView from "../views/message/messageView";

export type TControlPlayAgain = () => void;
const controlPlayAgain: TControlPlayAgain = () => {
  // Model
  model.resetForNextGame();
  // View
  boardView.clearBoard();

  if (model.getCurrentPlayer().isAI) {
    moveAi();
    return;
  }
};

const moveAi = async () => {
  const ai = model.getCurrentPlayer();
  await model.goAI();
  boardView.updateBoard({ data: model.state, player: ai });
  boardView.allowPlayerToSelect();

  if (model.state.game.gameOver) {
    menuView.renderPlayAgainButton();
    return;
  }

  boardView.allowPlayerToSelect();
};

export type TControlGame = ({}: { row: number; column: number }) => void;
const controlGame: TControlGame = async ({ column, row }) => {
  const moveHuman = () => {
    const player = model.getCurrentPlayer();
    model.startTurn({ column, row });

    // View
    // show mark based on column row
    boardView.updateBoard({ data: model.state, player });

    if (!model.state.game.hasAI) {
      boardView.allowPlayerToSelect();
    }

    if (model.state.game.gameOver) {
      menuView.renderPlayAgainButton();
      return;
    }
  };

  if (model.state.game.gameOver) return;

  // if turn is AI
  if (model.getCurrentPlayer().isAI) {
    moveAi();
    playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
    // signal human player turn
    return;
  }

  // if turn is human, then move human and then if AI exists, move AI afterwards
  moveHuman();
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
  // signal ai player turn
  if (model.state.game.gameOver) return;
  await moveAi();
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
  // signal human player turn
};

export type TControlStartGame = ({}: { id: string; ai: boolean }) => void;
const controlStartGame: TControlStartGame = ({ ai, id }) => {
  model.startGame();
  // set specific player as human or ai
  // starting game is hardcoded as player 2 confirming whether it's a human or an ai
  model.setPlayerAsHumanOrAI({ id, ai });
  playerBtnGroupView.updatePlayerBtnsOnGameStart();
  boardView.startGame();

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
  playerBtnGroupView.updateSvgMark(player);
  // update marks on board
  boardView.updateShapeInCells(player);
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
  // update slash color
  boardView.updateWinnerSlashColor(player.color);
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
  menuView.render(model.state.players);
  // messageView.render("Player 1 has Won!");

  // add handlers
  playerBtnGroupView.addHandlerChangeShape(controlPlayerShape);
  playerBtnGroupView.addHandlerChangeColor(controlPlayerColor);
  menuView.addHandlers({
    handlerStartGame: controlStartGame,
    handlerPlayAgain: controlPlayAgain,
  });
  boardView.addHandlerCell(controlGame);
};

init();
