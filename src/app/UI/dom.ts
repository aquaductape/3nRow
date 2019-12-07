import svg from "./svg";

const id = {
  btnPlayAgain: "btn-play_again",
  btnBotDropdown: "dropdown",
  btnBotDropdownContainer: "btn-dropdown",
  btnBot: "btn-bot",
  btnHuman: "btn-human",
  gameStart: "game-start",
  player1Btn: "P1-btn",
  player2Btn: "P2-btn"
};
const classes = {
  line: ".line-svg",
  stats: ".stats",
  dropDownSettings: ".dropdown-settings",
  playerMark: "player-mark",
  playerOptions: "player-options",
  playerName: "player-name"
};

const query = {
  column: "[data-column]",
  row: "[data-row]"
};

export const dom = {
  html: {
    btnPlayAgain: `<button id="${id.btnPlayAgain}" class="btn btn-primary btn-start">Play Again?</button>`,
    btnBotDropdown: `<div id="${id.btnBotDropdown}" class="dropdown hide-v"> <ul class="dropdown-settings"> <li class="dropdown-settings-list" tabindex="0">hard</li> <li class="dropdown-settings-list" tabindex="0">impossible</li> <li class="dropdown-settings-list" tabindex="0">cheater</li> </ul> </div>`
  },
  svg: {
    circle: svg.circle,
    cross: svg.cross,
    lineLong: svg.lineLong,
    lineShort: svg.lineShort
  },
  id: {
    btnPlayAgain: id.btnPlayAgain,
    btnBotDropdown: id.btnBotDropdown,
    btnBotDropdownContainer: id.btnBotDropdownContainer,
    btnBot: id.btnBot,
    btnHuman: id.btnHuman,
    gameStart: id.gameStart,
    player1Btn: id.player1Btn,
    player2Btn: id.player2Btn
  },
  class: {
    line: classes.line,
    stats: classes.stats,
    dropDownSettings: classes.dropDownSettings,
    playerMark: classes.playerMark,
    playerName: classes.playerName,
    playerOptions: classes.playerOptions
  },
  query: {
    row: query.row,
    column: query.column
  }
};
