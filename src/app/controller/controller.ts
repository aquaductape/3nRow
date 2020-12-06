import model from "../model/model";
import { TPlayer } from "../model/state";
import boardView from "../views/board/boardView";
import gameContainerView from "../views/gameContainer/gameContainerView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import gameMenuView from "../views/gameMenu/gameMenuView";
import { buildShapesForPlayers } from "../views/svg/shapes";
import svgDefsView from "../views/svg/svgDefsView";
import messageView from "../views/message/messageView";
import { getOppositePlayer } from "../views/utils/index";
import settingsView from "../views/settings/settingsView";
import skipToGameMenu from "../views/skipContentBtn/skipToGameMenuView";
import gameStatusAriaLiveRegionView from "../views/ariaLiveRegions/gameStatusAriaLiveRegionView";
import matchMediaView from "../views/windowEvents/matchMediaView";

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
    svgDefsView.updateShapeColors(model.state.players);
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
  gameStatusAriaLiveRegionView.announce({
    playerId: ai.id,
    position: model.state.game.markedPositions[0],
    state: "move",
    vs: "ai",
  });

  model.clearMarkedPositions();

  if (model.state.game.gameOver) {
    gameMenuView.renderPlayAgainButton();
    gameStatusAriaLiveRegionView.announce({
      playerId: ai.id,
      state: model.state.game.gameTie ? "tie" : "win",
      vs: "ai",
    });
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
  gameStatusAriaLiveRegionView.announce({
    playerId: player.id,
    state: "move",
    position: { column, row },
    vs: model.state.game.hasAI ? "ai" : "human",
  });

  if (!model.state.game.hasAI) {
    boardView.allowPlayerToSelect();
  }

  if (model.state.game.gameOver) {
    // model update random shape or color
    gameMenuView.renderPlayAgainButton();
    gameStatusAriaLiveRegionView.announce({
      playerId: player.id,
      state: model.state.game.gameTie ? "tie" : "win",
      vs: model.state.game.hasAI ? "ai" : "human",
    });
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
  firstMovePlayer: string;
  ai: boolean;
  difficulty?: string;
}) => void;
const controlStartGame: TControlStartGame = ({
  ai,
  firstMovePlayer,
  difficulty,
}) => {
  model.startGame();

  // at first any player could be ai,
  // as of now, only 2nd player is hard coded as ai
  model.setPlayerAsHumanOrAI({ id: "P2", ai, difficulty });
  model.setCurrentPlayer(firstMovePlayer);
  playerBtnGroupView.updatePlayerBtnsOnGameStart();
  boardView.startGame();
  svgDefsView.updateDropShadow("rgba(0, 0, 0, 0.35)");
  if (ai) {
    boardView.preventPlayerToSelect();
  }
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
  // settingsView.updateAi(model.state);
  skipToGameMenu.updateSkipBtnContent();

  if (ai) {
    moveAi();
  }
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
  //update marks on other View components
  boardView.updateShapeInCells(player);
  gameMenuView.updatePlayerMark(player);
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
  svgDefsView.updateShapeColors(model.state.players);
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
