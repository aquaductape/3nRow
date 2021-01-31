import model from "../model/model";
import boardView from "../views/board/boardView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import settingsView from "../views/settings/settingsView";
import skipToGameMenuView from "../views/skipContentBtn/skipToGameMenuView";
import svgDefsView from "../views/svg/svgDefsView";
import { moveAi } from "./move";

export type TControlVotePlayAgain = (prop: {
  triggeredByClick: boolean;
}) => void;
export const controlVotePlayAgain: TControlVotePlayAgain = ({
  triggeredByClick,
}) => {
  // TODO
  // rematch has a countdown and both players must agree to play right away instead of waiting for timer that upon closing will start the game.
};

export type TControlPlayAgainNow = (prop: {
  triggeredByClick: boolean;
}) => void;
export const controlPlayAgainNow: TControlPlayAgainNow = ({
  triggeredByClick,
}) => {
  const { room } = model.state.onlineMultiplayer;
  if (!room) return;

  // show spinner
  room.send("playAgainNow", true);
};

export type TControlPlayAgain = (prop: {
  triggeredByClick: boolean;
  firstMovePlayer?: string;
}) => void;
export const controlPlayAgain: TControlPlayAgain = async ({
  triggeredByClick = true,
  firstMovePlayer,
}) => {
  if (model.state.onlineMultiplayer.active) {
    controlPlayAgainNow({ triggeredByClick });
  }
  // Model
  model.setNextPlayerForFirstMove({ firstMovePlayer });
  model.resetForNextGame();
  // View
  boardView.clearBoard();
  boardView.startingGameTriggeredByKeyboard = !triggeredByClick;
  boardView.startGame();
  playerBtnGroupView.updatePlayerBtnsOnGameStart();

  const aiPlayer = model.getAiPlayer();
  const currentPlayer = model.getCurrentPlayer();

  // change ai skin
  if (model.state.game.hasAI) {
    const otherPlayer = model.getOppositePlayer(aiPlayer.id);
    model.randomChangePlayerSkin(aiPlayer);
    // update View shape and color
    svgDefsView.updateShapeColors(model.state.players);
    playerBtnGroupView.updateSvgMark(aiPlayer);
    settingsView.updatePlayerSVGMark(aiPlayer);
    // update dropdown lists
    playerBtnGroupView.updateSkinSelectionInDropdown({
      type: ["color", "shape"],
      player: aiPlayer,
    });
    playerBtnGroupView.updateSkinDisabledInDropdown({
      id: otherPlayer.id,
      type: ["color", "shape"],
      oppositePlayer: aiPlayer,
    });
  }

  if (currentPlayer.isAI) {
    boardView.preventPlayerToSelect();
  } else {
    boardView.allowPlayerToSelect();
  }

  if (model.state.onlineMultiplayer.active) {
    if (currentPlayer.id === model.state.onlineMultiplayer.mainPlayer) {
      boardView.allowPlayerToSelect();
    } else {
      boardView.preventPlayerToSelect();
    }
  }

  if (currentPlayer.isAI) {
    playerBtnGroupView.updatePlayerIndicator(model.getAiPlayer());
    await moveAi();
    playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
    return;
  }

  // if human starts game
  playerBtnGroupView.updatePlayerIndicator(currentPlayer);
};

export type TControlStartGame = (prop: {
  firstMovePlayer: string;
  ai: boolean;
  difficulty?: string;
  triggeredByClick?: boolean;
}) => void;
export const controlStartGame: TControlStartGame = ({
  ai,
  firstMovePlayer,
  difficulty,
  triggeredByClick = true,
}) => {
  model.startGame();

  // at first any player could be ai,
  // as of now, only 2nd player is hard coded as ai
  model.setPlayerAsHumanOrAI({ id: "P2", ai });
  model.setAiDifficulty({ id: "P2", difficulty });
  // in multiplayer, P1 is always first. This solves race condition when tab is inactive then revisted
  if (!model.state.onlineMultiplayer.active) {
    model.setCurrentPlayer(firstMovePlayer);
  }

  playerBtnGroupView.updatePlayerBtnsOnGameStart();
  boardView.startingGameTriggeredByKeyboard = !triggeredByClick;
  boardView.startGame();
  svgDefsView.updateDropShadow("rgba(0, 0, 0, 0.35)");

  if (ai) {
    boardView.preventPlayerToSelect();
  } else {
    boardView.allowPlayerToSelect();
  }

  const currentPlayer = model.getCurrentPlayer().id;
  if (model.state.onlineMultiplayer.active) {
    if (currentPlayer === model.state.onlineMultiplayer.mainPlayer) {
      boardView.allowPlayerToSelect();
    } else {
      boardView.preventPlayerToSelect();
    }
  }

  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
  skipToGameMenuView.updateSkipBtnContent();

  if (ai) {
    moveAi();
  }
};
