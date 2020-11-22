import { TPlayer, TShapes } from "../../model/state";
import { svg } from "../constants/constants";
import { svgStringWithUniqueIds } from "../utils/index";

const buildShapes = (id: string) => {
  const ignoreTriangleClasses = [
    "animate__first-line",
    "animate__second-line",
    "animate__third-line",
  ];
  const ignoreHeartClasses = ["animate__heart"];
  const ignoreCrossClasses = [
    "animate__right-dot",
    "animate__left-dot",
    "animate__right-line",
    "animate__left-line",
  ];
  const ignoreCircleClasses = ["animate__circle-left", "animate__circle-right"];
  const ignoreUrl = [
    "%crossLeftDot%",
    "%crossRightDot%",
    "#drop-shadow-filter",
  ];

  return {
    circle: svgStringWithUniqueIds({
      svg: svg.circle,
      id: `-circle-${id}`,
      ignoreClass: ignoreCircleClasses,
      ignoreUrl,
    }),
    cross: svgStringWithUniqueIds({
      svg: svg.cross,
      id: `-cross-${id}`,
      ignoreClass: ignoreCrossClasses,
      ignoreUrl,
    })
      .replace("%crossLeftDot%", `#a-crossLeftDot-${id}`)
      .replace("%crossRightDot%", `#a-crossRightDot-${id}`),
    triangle: svgStringWithUniqueIds({
      svg: svg.triangle,
      id: `-triangle-${id}`,
      ignoreClass: ignoreTriangleClasses,
      ignoreUrl,
    }),
    heart: svgStringWithUniqueIds({
      svg: svg.heart,
      id: `-heart-${id}`,
      ignoreClass: ignoreHeartClasses,
      ignoreUrl,
    }),
  };
};

export const buildShapesForPlayers = (players: TPlayer[]) => {
  const shapes: { [key: string]: TShapes } = {};

  players.forEach(({ id }) => {
    shapes[id] = buildShapes(id);
  });
  return shapes;
};
