import model from "../model/model";
import gameStatusAriaLiveRegionView from "../views/ariaLiveRegions/gameStatusAriaLiveRegionView";
import boardView from "../views/board/boardView";
import gameMenuView from "../views/gameMenu/gameMenuView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";

export type TControlMovePlayer = (prop: {
  row: number;
  column: number;
  userActionFromServer?: boolean;
}) => void;
export const controlMovePlayer: TControlMovePlayer = async ({
  column,
  row,
  userActionFromServer = false,
}) => {
  if (model.state.game.gameOver) return;

  // if turn is human, then move human and then if AI exists, move AI afterwards
  moveHuman({ column, row, userActionFromServer });
  if (model.state.game.gameOver) return gameOver();
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());

  // if turn is AI
  if (!model.getCurrentPlayer().isAI) return;

  await moveAi();
  if (model.state.game.gameOver) return gameOver();
  playerBtnGroupView.updatePlayerIndicator(model.getCurrentPlayer());
};

export const moveHuman = ({
  column,
  row,
  userActionFromServer,
}: {
  column: number;
  row: number;
  userActionFromServer?: boolean;
}) => {
  const player = model.getCurrentPlayer();
  boardView.preventPlayerToSelect();
  model.startTurn({ column, row });
  if (model.state.onlineMultiplayer.active && !userActionFromServer) {
    const { room } = model.state.onlineMultiplayer;
    console.log("fire send move");
    room!.send("move", { column, row });
  }
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
    if (model.state.onlineMultiplayer.active) {
      if (userActionFromServer) {
        boardView.allowPlayerToSelect();
      }
    } else {
      boardView.allowPlayerToSelect();
    }
  }

  if (model.state.game.gameOver) {
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
  const transitionTimeout = model.state.game.gameTie ? 900 : 1200;
  const mainPlayer = model.getPlayerById(
    model.state.onlineMultiplayer.mainPlayer
  )!;
  const winnerPlayer = model.getWinner()!;
  const loserPlayer = model.getLoser()!;
  let player = winnerPlayer;
  let declare = "winner" as "winner" | "loser";

  model.runGameOver();
  boardView.preventPlayerToSelect();
  model.state.game.getCurrentPlayer;

  if (model.state.game.hasAI && model.getAiPlayer() === winnerPlayer) {
    declare = "loser";
    player = loserPlayer;
  }

  if (model.state.onlineMultiplayer.active && mainPlayer !== winnerPlayer) {
    declare = "loser";
    player = loserPlayer;
  }

  // gameMenuView.renderPlayAgainButton();
  setTimeout(() => {
    gameMenuView.renderResultMenu({
      declare,
      player,
      tie: model.state.game.gameTie,
    });
    boardView.preGame();
    playerBtnGroupView.updatePlayerBtnsOnPreGame();
  }, transitionTimeout);

  if (model.state.game.gameTie) {
    playerBtnGroupView.resetPlayerIndicators();
    return;
  }

  model.increaseWinnerScore();
  playerBtnGroupView.updatePlayerScore(winnerPlayer);
};
