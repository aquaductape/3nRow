import { TPlayer, TState } from "../../model/state";
import { colorMap } from "../constants/constants";
import { svgStringWithUniqueIds } from "../utils/index";
import View from "../View";

class SvgDefsView extends View {
  data: TPlayer[];
  constructor() {
    super({ root: ".svg-defs-container" });
    this.data = [];
  }

  protected generateMarkup() {
    const players = this.data;
    const defsContainer = (...defs: string[]) => {
      return (
        defsCollection.openingDef +
        defsCollection.dropShadow +
        defs.join("") +
        defsCollection.closingDef
      );
    };

    const getStrShapesAll = (id: string) => {
      return shapesDefs
        .map((shape) =>
          svgStringWithUniqueIds({
            id: `-${shape}-${id}`,
            svg: defsCollection[shape],
          })
        )
        .join("");
    };

    const createSVGGraphicsInsideDefs = (players: TPlayer[]) => {
      const playerShapes = players
        .map((player) => getStrShapesAll(player.id))
        .join("");

      return defsContainer(playerShapes);
    };

    return createSVGGraphicsInsideDefs(players);
  }

  private removeDefs() {
    this.clear();
  }

  private setColor(player: TPlayer, shape: string) {
    const [primaryColor, secondaryColor] = colorMap[player.color];
    const shapeColorPrimary = `.color-primary-${shape}-${player.id}`;
    const shapeColorSecondary = `.color-secondary-${shape}-${player.id}`;
    const colorPrimary = <NodeListOf<SVGElement>>(
      document.querySelectorAll(shapeColorPrimary)
    );
    const colorSecondary = <NodeListOf<HTMLElement>>(
      document.querySelectorAll(shapeColorSecondary)
    );
    colorPrimary.forEach((el) => {
      el.setAttribute("stop-color", primaryColor);
    });
    colorSecondary.forEach((el) => {
      el.setAttribute("stop-color", secondaryColor);
    });
  }

  // override to set colors immediately after render
  render(data: TPlayer[]) {
    this.data = data;
    this.parentEl.innerHTML = this.generateMarkup();
    this.setColors();
  }

  setColors() {
    const setAllColors = (player: TPlayer) => {
      for (let shape of shapesDefs) {
        this.setColor(player, shape);
      }
    };

    const players = this.data;

    players.forEach(setAllColors);
  }
}
type TDefsCollection = {
  openingDef: string;
  closingDef: string;
  crossLeftDot: string;
  crossRightDot: string;
  circle: string;
  cross: string;
  triangle: string;
  heart: string;
  dropShadow: string;
  [key: string]: string;
};

const defsCollection: TDefsCollection = {
  openingDef: `<svg xmlns="http://www.w3.org/2000/svg" class="defs-collection" height="0" width="0" viewBox="0 0 32 32">
    <defs>`,
  closingDef: `</defs></svg>`,
  crossLeftDot: `<linearGradient id="a">
      <stop class="color-primary" stop-color="#000"/>
    </linearGradient>`,
  crossRightDot: `<linearGradient id="a">
    <stop class="color-secondary" stop-color="#000"/>
  </linearGradient>`,
  circle: `<linearGradient id="a">
    <stop offset="0" class="color-primary" stop-color="#ff4900"/>
    <stop offset="1" class="color-secondary" stop-color="#ffc300"/>
  </linearGradient>
  <linearGradient xlink:href="#a" id="b" x1="53.5009" y1="-2.4148" x2="53.5009" y2="13.775" gradientUnits="userSpaceOnUse"/>`,
  cross: `
  <linearGradient id="b">
    <stop class="color-primary" offset="0" stop-color="currentColor"/>
    <stop class="color-secondary" offset="1" stop-color="currentColor"/>
  </linearGradient>
  <linearGradient id="a">
    <stop class="color-secondary" offset="0" stop-color="currentColor"/>
    <stop class="color-primary" offset="1" stop-color="currentColor"/>
  </linearGradient>
  <linearGradient gradientUnits="userSpaceOnUse" y2="19.9728" x2="6.4856" y1="13.2292" x1="13.2292" id="d" xlink:href="#a"/>
  <linearGradient gradientUnits="userSpaceOnUse" y2="22.7431" x2="21.9646" y1="11.6221" x1="11.6221" id="c" xlink:href="#b"/>`,
  triangle: `
    <linearGradient id="a">
      <stop class="color-primary" offset="0" stop-color="#0cf"/>
      <stop class="color-secondary" offset="1" stop-color="#5fd"/>
    </linearGradient>
    <linearGradient y2="22.7431" x2="21.9646" y1="11.6221" x1="11.6221" gradientTransform="rotate(135 12.262 17.1198)" gradientUnits="userSpaceOnUse" id="b" xlink:href="#a"/>
    <linearGradient y2="2.5327" x2="14.1158" y1="17.7946" x1="17.659" gradientTransform="rotate(-105 11.2177 15.5445)" gradientUnits="userSpaceOnUse" id="c" xlink:href="#a"/>
    <linearGradient y2="5.1297" x2="6.2886" y1="16.1127" x1="17.2162" gradientTransform="rotate(15 18.6084 26.6946)" gradientUnits="userSpaceOnUse" id="d" xlink:href="#a"/>
`,
  heart: `
    <linearGradient id="e">
      <stop class="color-primary" offset="0" stop-color="#ff005b"/>
      <stop class="color-secondary" offset="1" stop-color="#ff00e4" stop-opacity=".9843"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" y2="20.5725" x2="15.9935" y1="4.2042" x1="12.8753" id="f" xlink:href="#e"/>`,
  dropShadow: `
    <filter id="drop-shadow-filter" height="100" width="100" filterUnits="userSpaceOnUse"  color-interpolation-filters="sRGB">
      <feFlood flood-opacity="1" flood-color="rgba(0, 0, 0, 0.35)" result="flood"/>
      <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite1"/>
      <feGaussianBlur in="composite1" result="blur"/>
      <feOffset dy="1.8" result="offset"/>
      <feComposite in="SourceGraphic" in2="offset" result="composite2"/>
    </filter>
    <filter id="drop-shadow-filter-slash" height="100" width="100" filterUnits="userSpaceOnUse"  color-interpolation-filters="sRGB">
      <feFlood flood-opacity="1" flood-color="rgba(0, 0, 0, 0.35)" result="flood"/>
      <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite1"/>
      <feGaussianBlur in="composite1" result="blur"/>
      <feOffset dy="0.7" result="offset"/>
      <feComposite in="SourceGraphic" in2="offset" result="composite2"/>
    </filter>    

    `,
};

const shapesDefs = [
  "cross",
  "circle",
  "triangle",
  "heart",
  "crossLeftDot",
  "crossRightDot",
];

export default new SvgDefsView();
