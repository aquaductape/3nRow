import model from "../model/model";
import { TPlayer } from "../model/state";
import boardView from "../views/board/boardView";
import gameContainerView from "../views/gameContainer/gameContainerView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import gameMenu from "../views/gameMenu/gameMenuView";
import { buildShapesForPlayers } from "../views/svg/shapes";
import svgDefsView from "../views/svg/svgDefsView";
import messageView from "../views/message/messageView";
import { getOppositePlayer } from "../views/utils/index";
import settingsView from "../views/settings/settingsView";
import skipToGameMenu from "../views/skipContentBtn/skipToGameMenuView";

export type TControlSettings = (prop: {
  ai?: {
    enabled: boolean;
    difficulty?: string;
  };
}) => void;
const controlSettings: TControlSettings = ({ ai }) => {
  if (ai) {
    model.setPlayerAsHumanOrAI({
      id: "P2",
      ai: ai.enabled,
      difficulty: ai.difficulty,
    });
  }

  settingsView.updateAi(model.state);
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

export type TMoveAi = (prop?: { delay?: number }) => void;
const moveAi: TMoveAi = async ({ delay } = {}) => {
  const ai = model.getCurrentPlayer();

  if (!ai.isAI && ai.id !== "P1") return;
  boardView.preventPlayerToSelect();

  await model.goAI({ delay });
  boardView.updateBoard({ data: model.state, player: ai });
  boardView.allowPlayerToSelect();
  model.clearMarkedPositions();

  if (model.state.game.gameOver) {
    gameMenu.renderPlayAgainButton();
    return;
  }

  boardView.allowPlayerToSelect();
};

const moveHuman = ({ column, row }: { column: number; row: number }) => {
  const player = model.getCurrentPlayer();
  boardView.preventPlayerToSelect();
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
    gameMenu.renderPlayAgainButton();
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

export type TMovePlayer = (prop: { row: number; column: number }) => void;
const movePlayer: TMovePlayer = async ({ column, row }) => {
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

export type TControlStartGame = (prop: {
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
  settingsView.updateAi(model.state);
  skipToGameMenu.updateSkipBtnContent();

  // player 1 goes first regardless
};

export type TControlPlayerShape = (prop: {
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

export type TControlPlayerColor = (prop: {
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

export const init = () => {
  localStorage.clear();
  // model
  model.updateStateFromLS();
  model.setShapes(buildShapesForPlayers(model.state.players));

  // render views
  svgDefsView.render(model.state.players);
  playerBtnGroupView.render(model.state);
  boardView.render(model.state);
  gameMenu.render(model.state.players);
  skipToGameMenu.render();
  settingsView.render(model.state);
  // messageView.render("Player 1 has Won!");

  // add handlers
  playerBtnGroupView.addHandlers({
    handlerChangeColor: controlPlayerColor,
    handlerChangeShape: controlPlayerShape,
  });
  gameMenu.addHandlers({
    handlerStartGame: controlStartGame,
    handlerPlayAgain: controlPlayAgain,
    handlerMenuSettings: controlSettings,
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
