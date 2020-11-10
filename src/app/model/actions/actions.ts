import { state, TPlayer, TShapes } from "../state";

type TSetShapesProp = {
  [key: string]: TShapes;
};

export const setShapes = (shapes: TSetShapesProp) => {
  state.players.forEach((player) =>
    setShape({ player, shape: shapes[player.id] })
  );
};

export const setShape = ({
  player,
  shape,
}: {
  shape: TShapes;
  player: TPlayer;
}) => {
  player.shapes = shape;
};
