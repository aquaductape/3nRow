import model from "../model/model";
import gameStatusAriaLiveRegionView from "../views/ariaLiveRegions/gameStatusAriaLiveRegionView";
import boardView from "../views/board/boardView";
import gameMenuView from "../views/gameMenu/gameMenuView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";

export type TMovePlayer = (prop: { row: number; column: number }) => void;
export const movePlayer: TMovePlayer = async ({ column, row }) => {
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

export const moveHuman = ({ column, row }: { column: number; row: number }) => {
  const player = model.getCurrentPlayer();
  boardView.preventPlayerToSelect();
  model.startTurn({ column, row });
  // socket.emit("player move", { column, row });
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

export type TMoveAi = (prop?: { delay?: number }) => void;
export const moveAi: TMoveAi = async ({ delay } = {}) => {
  if (model.state.game.gameOver) return;

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

const gameOver = () => {
  model.runGameOver();

  if (model.state.game.gameTie) {
    playerBtnGroupView.resetPlayerIndicators();
    return;
  }

  model.increaseWinnerScore();
  playerBtnGroupView.updatePlayerScore(model.getWinner()!);
};
