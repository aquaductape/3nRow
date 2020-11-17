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
  const ignoreUrl = ["%crossLeftDot%", "%crossRightDot%"];

  return {
    circle: svgStringWithUniqueIds({
      svg: svg.circle,
      id: `-circle-${id}`,
      ignoreClass: ignoreCircleClasses,
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
    }),
    heart: svgStringWithUniqueIds({
      svg: svg.heart,
      id: `-heart-${id}`,
      ignoreClass: ignoreHeartClasses,
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

export const lines = {
  lineShort: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg8" version="1.1" viewBox="0 0 26.4583 26.4583" height="100" width="100">
  <defs id="defs2">
    <linearGradient id="linearGradient3722">
      <stop id="stop3718" class="line-color-primary" offset="0" stop-color="#2a7fff" stop-opacity="1"/>
      <stop id="stop3720" class="line-color-secondary" offset="1" stop-color="#2ae4ff" stop-opacity="1"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" id="linearGradient3724" xlink:href="#linearGradient3722"/>
    <linearGradient gradientTransform="rotate(45 10.9613 289.246)" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" gradientUnits="userSpaceOnUse" id="linearGradient3738" xlink:href="#linearGradient3722"/>
  </defs>
  <g class="animate__line-short" style="transform-origin:13.2291665px 13.2291665px">
    <g class="animate__line-short-inner translate" style="transform-origin:13.2291665px 13.2291665px">
      <path class="path3716" d="M 1.5355285,283.77082 H 24.922805" transform="translate(0 -270.5417)" fill="none" stroke="url(#linearGradient3724)" stroke-width="1.3229" stroke-linecap="round"/>
    </g>
  </g>
</svg>`,
  lineLong: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg8" version="1.1" viewBox="0 0 26.4583 26.4583" height="100" width="100">
  <defs id="defs2">
    <linearGradient id="linearGradient3722">
      <stop id="stop3718" class="line-color-primary" offset="0" stop-color="#2a7fff" stop-opacity="1"/>
      <stop id="stop3720" class="line-color-secondary" offset="1" stop-color="#2ae4ff" stop-opacity="1"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" id="linearGradient3724" xlink:href="#linearGradient3722"/>
    <linearGradient gradientTransform="rotate(45 10.9613 289.246)" y2="283.7708" x2="25.5937" y1="283.7708" x1=".8646" gradientUnits="userSpaceOnUse" id="linearGradient3738" xlink:href="#linearGradient3722"/>
  </defs>
  <g class="animate__line-long" style="transform-origin:13.2291665px 13.2291665px">
    <path d="M 1.7532815,272.29493 24.705052,295.24671" class="path3726" transform="translate(0 -270.5417)" fill="none" stroke="url(#linearGradient3738)" stroke-width="1.3229" stroke-linecap="round"/>
  </g>
</svg>`,
};
