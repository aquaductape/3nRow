import model from "../model/model";
import boardView from "../views/board/boardView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import settingsView from "../views/settings/settingsView";
import skipToGameMenuView from "../views/skipContentBtn/skipToGameMenuView";
import svgDefsView from "../views/svg/svgDefsView";
import { getOppositePlayer } from "../views/utils";
import { moveAi } from "./move";

export type TControlPlayAgain = () => void;
export const controlPlayAgain: TControlPlayAgain = async () => {
  // Model
  model.setNextPlayerForFirstMove();
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

  if (model.getCurrentPlayer().isAI) {
    playerBtnGroupView.updatePlayerIndicator(model.getAiPlayer());
    await moveAi();
    playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
    return;
  }

  // if human starts game
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
};

export type TControlStartGame = (prop: {
  firstMovePlayer: string;
  ai: boolean;
  difficulty?: string;
}) => void;
export const controlStartGame: TControlStartGame = ({
  ai,
  firstMovePlayer,
  difficulty,
}) => {
  model.startGame();

  // at first any player could be ai,
  // as of now, only 2nd player is hard coded as ai
  model.setPlayerAsHumanOrAI({ id: "P2", ai });
  model.setAiDifficulty({ id: "P2", difficulty });
  model.setCurrentPlayer(firstMovePlayer);

  playerBtnGroupView.updatePlayerBtnsOnGameStart();
  boardView.startGame();
  svgDefsView.updateDropShadow("rgba(0, 0, 0, 0.35)");

  if (ai) {
    boardView.preventPlayerToSelect();
  }

  if (model.state.onlineMultiplayer.opponentPlayer === firstMovePlayer) {
    boardView.preventPlayerToSelect();
  }

  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
  skipToGameMenuView.updateSkipBtnContent();

  if (ai) {
    moveAi();
  }
};
