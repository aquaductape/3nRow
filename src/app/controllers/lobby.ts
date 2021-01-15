import model from "../model/model";
import lobbyView from "../views/lobby/lobbyView";
import preGameView from "../views/lobby/preGameView";
import svgDefsView from "../views/svg/svgDefsView";

export type TControlPickSkin = (props: {
  type: "color" | "shape";
  item: string;
}) => void;
export const controlPickSkin: TControlPickSkin = ({ type, item }) => {
  const { room, pickedItems } = model.state.onlineMultiplayer;
  const mainPlayer = model.getPlayerById(
    model.state.onlineMultiplayer.mainPlayer
  )!;
  const opponentPlayerId = model.state.onlineMultiplayer.opponentPlayer;
  const opponentPlayer = model.getPlayerById(opponentPlayerId)!;
  if (!room) return;

  model.setPickedSkinInLobby({ type, item });

  // oppponent has already picked ahead and recieved confirmation from server, so no need WAIT confirmation from the server
  if (type === "color" && opponentPlayer.color) {
    // console.log("controlPickSkin", mainPlayer);
    model.setPlayerCurrentColor({ player: mainPlayer, color: item });
    svgDefsView.updateShapeColors(model.state.players);
    preGameView.setData({ mainPlayer });
    preGameView.transitionPickSkin({ type: "shape" });
  }

  if (type === "shape" && opponentPlayer.shape) {
    preGameView.transitionPreGameStage({ type: "preparing-game" });
  }

  // setTimeout(() => {
  room.send("pickSkin", {
    type,
    value: item,
    playerId: model.state.onlineMultiplayer.mainPlayer,
  });
  // }, 5000);
};
