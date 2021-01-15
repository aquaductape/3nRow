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
  const ignoreSquareClasses = [
    "animate__square-dot-1",
    "animate__square-dot-2",
    "animate__square-dot-3",
    "animate__square-dot-4",
    "animate__square-line-1",
    "animate__square-line-2",
    "animate__square-line-3",
    "animate__square-line-4",
  ];
  const ignoreUrl = [
    "%primaryColor%",
    "%secondaryColor%",
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
      .replace("%primaryColor%", `#a-primaryColor-${id}`)
      .replace("%secondaryColor%", `#a-secondaryColor-${id}`),
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
    square: svgStringWithUniqueIds({
      svg: svg.square,
      id: `-square-${id}`,
      ignoreClass: ignoreSquareClasses,
      ignoreUrl,
    })
      .replace(/%primaryColor%/g, `#a-primaryColor-${id}`)
      .replace(/%secondaryColor%/g, `#a-secondaryColor-${id}`),
    kite: svgStringWithUniqueIds({
      svg: svg.kite,
      id: `-kite-${id}`,
      ignoreUrl,
    }).replace(/%primaryColor%/g, `#a-primaryColor-${id}`),
  };
};

export const buildShapesForPlayers = (players: TPlayer[]) => {
  const shapes: { [key: string]: TShapes } = {};

  players.forEach(({ id }) => {
    shapes[id] = buildShapes(id);
  });
  return shapes;
};
