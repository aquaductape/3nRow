import svg from "./svg";

const id = {
  btnPlayAgain: "btn-play_again",
  btnBotDropdown: "dropdown",
  btnBotDropdownContainer: "btn-dropdown",
  btnBot: "btn-bot",
  btnHuman: "btn-human",
  gameStart: "game-start",
  P1BtnOptions: "P1-btn-options",
  P2BtnOptions: "P2-btn-options",
  P1Options: "P1-options",
  P2Options: "P2-options"
};
const classes = {
  line: ".line-svg",
  stats: ".stats",
  dropDownSettings: ".dropdown-settings",
  playerMark: "player-mark",
  playerOptions: "player-options",
  playerName: "player-name",
  gameContainer: "game-container",
  shapeColorPrimary: "color-primary",
  shapeColorSecondary: "color-secondary",
  shapeGroup: "shape-group",
  options: "dropdown-options"
};

const query = {
  column: "[data-column]",
  row: "[data-row]"
};

export const dom = {
  html: {
    btnPlayAgain: `<button id="${id.btnPlayAgain}" class="btn btn-primary btn-start">Play Again?</button>`,
    btnBotDropdown: `<div id="${id.btnBotDropdown}" class="dropdown hide-v"> <ul class="dropdown-settings"> <li class="dropdown-settings-list" tabindex="0">hard</li> <li class="dropdown-settings-list" tabindex="0">impossible</li> <li class="dropdown-settings-list" tabindex="0">cheater</li> </ul> </div>`,
    options: `<div class="dropdown-options %PLAYERID%-options"> <div class="dropdown-options-container"> <div class="options-shape"> <h2 class="options-title">Shape</h2> <hr> <ul class="shape-group"></ul> </div> <div class="options-color"> <h2 class="options-title">Color</h2> <hr> <ul class="color-group"> <li class="color-list"> <div class="color-box color-1"> <div class="primary-color"></div> <div class="secondary-color"></div> </div> </li> <li class="color-list"> <div class="color-box color-2"> <div class="primary-color"></div> <div class="secondary-color"></div> </div> </li> </ul> </div> %AI% <div class="options-gameplay"> <hr> <button class="btn btn-secondary options-btn">Restart</button> <button class="btn btn-secondary options-btn">Reset Score</button> </div> </div> </div>`,
    optionsAI: `<div class="options-ai"> <h2 class="options-title">AI</h2> <hr> <div id="btn-dropdown" class="btn-dropdown"><button id="btn-bot" class="btn btn-secondary options-btn">hard</button> <div class="dropdown hide-v"> <ul class="dropdown-settings"> <li class="dropdown-settings-list" tabindex="0">hard</li> <li class="dropdown-settings-list" tabindex="0">impossible</li> <li class="dropdown-settings-list" tabindex="0">cheater</li> </ul> </div> </div> <button class="btn btn-secondary options-btn">Apply</button> <button class="btn btn-secondary options-btn">Apply & Restart</button> </div>`
  },
  svg: {
    ...svg
  },
  id: {
    ...id
  },
  class: {
    ...classes
  },
  query: {
    ...query
  }
};
