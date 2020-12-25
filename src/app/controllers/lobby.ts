import model from "../model/model";

export type TControlPickSkin = (props: {
  type: "color" | "shape";
  item: string;
}) => void;
export const controlPickSkin: TControlPickSkin = ({ type, item }) => {
  const { room } = model.state.onlineMultiplayer;
  if (!room) return;

  // setTimeout(() => {
  //   room.send("pickSkin", {
  //     type,
  //     value: item,
  //     playerId: model.state.onlineMultiplayer.mainPlayer,
  //   });
  // }, 9000);
};
