import svg from "./svg";

const id = {
  btnPlayAgain: "btn-play_again",
  checkboxAi: "checkbox-ai",
  gameStart: "game-start",
  P1BtnOptions: "P1-btn-options",
  P2BtnOptions: "P2-btn-options",
  P1Options: "P1-options",
  P2Options: "P2-options",
  optionsResetScores: "options-reset-scores",
  optionsRestart: "options-restart"
};
const className = {
  line: ".line-svg",
  stats: ".stats",
  board: "board",
  btnAi: "btn-ai",
  btnHuman: "btn-human",
  dropDownDifficulty: "dropdown-difficulty",
  btnDifficultyDDContainer: "btn-dropdown-difficulty",
  dropDownSettings: ".dropdown-settings",
  playerBtnOptions: "player-btn-options",
  dropDownOptions: "dropdown-options",
  optionsFriend: "options-friend",
  playerMark: "player-mark",
  playerOptions: "player-options",
  playerName: "player-name",
  playerScore: "player-score",
  gameContainer: "game-container",
  shapeColorPrimary: "color-primary",
  shapeColorSecondary: "color-secondary",
  shapeGroup: "shape-group",
  colorGroup: "color-group",
  options: "dropdown-options",
  animateCircleLeft: "animate__circle-left",
  animateCircleRight: "animate__circle-right",
  animateRightDot: "animate__right-dot",
  animateLeftDot: "animate__left-dot",
  animateRightLine: "animate__right-line",
  animateLeftLine: "animate__left-line",
  animateFirstLine: "animete__first-line",
  animateSecondLine: "animete__second-line",
  animateThirdLine: "animete__third-line"
};

const query = {
  dataColumn: "[data-column]",
  dataRow: "[data-row]",
  dataPlayerP1: "[data-player='P1']"
};

export const dom = {
  html: {
    btnPlayAgain: `<button id="${id.btnPlayAgain}" class="btn btn-primary btn-start">Play Again?</button>`,
    btnBotDropdown: `<div  class="${className.dropDownDifficulty} dropdown hide-v"> <ul class="dropdown-settings"> <li class="dropdown-settings-list" tabindex="0">hard</li> <li class="dropdown-settings-list" tabindex="0">impossible</li> <li class="dropdown-settings-list" tabindex="0">cheater</li> </ul> </div>`,
    options: `<div class="dropdown-options %PLAYERID%-options"> <div class="dropdown-options-container"> <div class="options-shape"> <h2 class="options-title">Shape</h2> <hr> <ul class="shape-group"></ul> </div> <div class="options-color"> <h2 class="options-title">Color</h2> <hr> <ul class="color-group"></ul> </div> %AI% <div class="options-gameplay"> <hr> <button id="options-restart" class="btn btn-secondary options-btn">Restart</button> <button id="options-reset-scores" class="btn btn-secondary options-btn">Reset Scores</button> </div> </div> </div>`,
    optionsAI: `<div class="options-ai"> <h2 class="options-title">Play Against ...</h2> <hr> <div class="btn-dropdown-difficulty btn-dropdown options-dropdown"><button class="btn-ai btn btn-secondary options-btn">AI Difficulty</button> </div><button class="options-friend btn btn-secondary options-btn">Friend</button>`
  },
  svg: {
    ...svg
  },
  id: {
    ...id
  },
  class: {
    ...className
  },
  query: {
    ...query
  }
};
