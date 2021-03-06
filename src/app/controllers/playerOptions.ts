import model from "../model/model";
import { TPlayer } from "../model/state";
import boardView from "../views/board/boardView";
import gameMenuView from "../views/gameMenu/gameMenuView";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import settingsView from "../views/settings/settingsView";
import svgDefsView from "../views/svg/svgDefsView";
import { getOppositePlayer } from "../views/utils";

export type TControlPlayerColor = (prop: {
  player: TPlayer;
  color: string;
  prevColor?: string;
  userActionFromServer?: boolean;
}) => void;
export const controlPlayerColor: TControlPlayerColor = ({
  player,
  color,
  prevColor,
  userActionFromServer,
}) => {
  if (model.state.onlineMultiplayer.active && !userActionFromServer) {
    const { room } = model.state.onlineMultiplayer;
    room!.send("pickSkin", {
      type: "color",
      value: color,
      prevValue: prevColor!,
      playerId: player.id,
    });
    return;
  }
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
    oppositePlayer: player,
  });
};

export type TControlPlayerShape = (prop: {
  player: TPlayer;
  shape: string;
  prevShape?: string;
  userActionFromServer?: boolean;
}) => void;
export const controlPlayerShape: TControlPlayerShape = ({
  player,
  shape,
  prevShape,
  userActionFromServer,
}) => {
  if (model.state.onlineMultiplayer.active && !userActionFromServer) {
    const { room } = model.state.onlineMultiplayer;
    room!.send("pickSkin", {
      type: "shape",
      value: shape,
      prevValue: prevShape!,
      playerId: player.id,
    });
    return;
  }
  // Model
  // update player shape
  model.setPlayerCurrentShape({ player, shape });

  // View
  // update btn mark
  playerBtnGroupView.updateSvgMark(player);
  //update marks on other View components
  boardView.updateShapeInCells(player);
  gameMenuView.updatePlayerMark(player);
  if (player.id === "P2") settingsView.updatePlayerSVGMark(player);
  // update disabled for other player
  const otherPlayer = getOppositePlayer({
    id: player.id,
    players: model.state.players,
  });
  playerBtnGroupView.updateSkinDisabledInDropdown({
    id: otherPlayer.id,
    type: "shape",
    oppositePlayer: player,
  });
};
