import model from "../model/model";
import { TPlayer } from "../model/state";
import boardView from "../views/board/boardView";
import gameContainerView from "../views/gameContainer/gameContainerView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import quickStartMenuView from "../views/quickStartMenu/quickStartMenuView";
import { buildShapesForPlayers } from "../views/svg/shapes";
import svgDefsView from "../views/svg/svgDefsView";
import messageView from "../views/message/messageView";
import { getOppositePlayer } from "../views/utils/index";
import menuView from "../views/menu/menuView";

export type TControlMenuSettings = ({}: {
  ai?: {
    enabled: boolean;
    difficulty: string;
  };
}) => void;
const controlMenuSettings: TControlMenuSettings = ({ ai }) => {
  if (ai) {
    model.setPlayerAsHumanOrAI({
      id: "P2",
      ai: ai.enabled,
      difficulty: ai.difficulty,
    });
  }
};

export type TControlPlayAgain = () => void;
const controlPlayAgain: TControlPlayAgain = async () => {
  // Model
  model.resetForNextGame();
  // View
  boardView.clearBoard();

  const aiPlayer = model.getAiPlayer();

  // change ai skin
  if (model.state.game.hasAI) {
    const otherPlayer = getOppositePlayer({
      id: aiPlayer.id,
      players: model.state.players,
    });
    model.randomChangePlayerSkin(aiPlayer);
    // update View shape and color
    svgDefsView.render(model.state.players);
    playerBtnGroupView.updateSvgMark(aiPlayer);
    // update dropdown lists
    playerBtnGroupView.updateSkinSelectionInDropdown({
      type: ["color", "shape"],
      player: aiPlayer,
    });
    playerBtnGroupView.updateSkinDisabledInDropdown({
      id: otherPlayer.id,
      type: ["color", "shape"],
      player: aiPlayer,
    });
  }

  if (model.getCurrentPlayer().isAI) {
    playerBtnGroupView.updatePlayerIndicator(model.getAiPlayer());
    await moveAi();
    playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
    return;
  }

  // if human starts game
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
};

const moveAi = async () => {
  const ai = model.getCurrentPlayer();
  await model.goAI();
  boardView.updateBoard({ data: model.state, player: ai });
  boardView.allowPlayerToSelect();
  model.clearMarkedPositions();

  if (model.state.game.gameOver) {
    quickStartMenuView.renderPlayAgainButton();
    return;
  }

  boardView.allowPlayerToSelect();
};

const moveHuman = ({ column, row }: { column: number; row: number }) => {
  const player = model.getCurrentPlayer();
  model.startTurn({ column, row });

  // View
  // show mark based on column row
  boardView.updateBoard({ data: model.state, player });
  model.clearMarkedPositions();

  if (!model.state.game.hasAI) {
    boardView.allowPlayerToSelect();
  }

  if (model.state.game.gameOver) {
    // model update random shape or color
    quickStartMenuView.renderPlayAgainButton();
    return;
  }
};

const gameOver = () => {
  model.runGameOver();

  if (model.state.game.gameTie) {
    playerBtnGroupView.resetPlayerIndicators();
    return;
  }

  model.increaseWinnerScore();
  playerBtnGroupView.updatePlayerScore(model.getWinner()!);
};

export type TControlGame = ({}: { row: number; column: number }) => void;
const controlGame: TControlGame = async ({ column, row }) => {
  if (model.state.game.gameOver) return gameOver();

  // if turn is human, then move human and then if AI exists, move AI afterwards
  moveHuman({ column, row });
  if (model.state.game.gameOver) return gameOver();
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());

  // if turn is AI
  if (!model.getCurrentPlayer().isAI) return;

  await moveAi();
  if (model.state.game.gameOver) return gameOver();
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
};

export type TControlStartGame = ({}: {
  id: string;
  ai: boolean;
  difficulty?: string;
}) => void;
const controlStartGame: TControlStartGame = ({ ai, id, difficulty }) => {
  model.startGame();
  // set specific player as human or ai
  // starting game is hardcoded as player 2 confirming whether it's a human or an ai
  model.setPlayerAsHumanOrAI({ id, ai, difficulty });
  playerBtnGroupView.updatePlayerBtnsOnGameStart();
  boardView.startGame();
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
  menuView.updateSettings(model.state);

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
  // update disabled for other player
  const otherPlayer = getOppositePlayer({
    id: player.id,
    players: model.state.players,
  });
  playerBtnGroupView.updateSkinDisabledInDropdown({
    id: otherPlayer.id,
    type: "shape",
    player,
  });
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
  // update indicator color

  if (
    model.state.game.gameRunning &&
    model.state.game.getCurrentPlayer() === player
  ) {
    playerBtnGroupView.updatePlayerIndicator(player);
  }
  // update disabled for other player
  const otherPlayer = getOppositePlayer({
    id: player.id,
    players: model.state.players,
  });
  playerBtnGroupView.updateSkinDisabledInDropdown({
    id: otherPlayer.id,
    type: "color",
    player,
  });
};

const init = () => {
  localStorage.clear();
  // model
  model.updateStateFromLS();
  model.setShapes(buildShapesForPlayers(model.state.players));

  // render views
  svgDefsView.render(model.state.players);
  playerBtnGroupView.render(model.state);
  boardView.render(model.state);
  quickStartMenuView.render(model.state.players);

  menuView.render(model.state);
  // messageView.render("Player 1 has Won!");

  // add handlers
  playerBtnGroupView.addHandlers({
    handlerChangeColor: controlPlayerColor,
    handlerChangeShape: controlPlayerShape,
  });
  quickStartMenuView.addHandlers({
    handlerStartGame: controlStartGame,
    handlerPlayAgain: controlPlayAgain,
  });
  boardView.addHandlerCell(controlGame);
  // run DOM events
  gameContainerView.runResizeListener();
};

init();
