import { TLobbyType } from "../lobby/lobbyView";

type TBtn = {
  id?: string;
  type?: "button" | "link";
  content: string;
  dataAttributes: {
    lobbyType?: TLobbyType;
    [key: string]: string | undefined;
  };
  aria: {
    [key: string]: string;
  };
  toolTip?: string;
  classNames: string[];
};
type TMenu = {
  titleId?: string;
  title: string | null;
  section: string;
  listBtns: TBtn[];
  btn?: string;
};

export type TGameMenuState = {
  start: TMenu;
  aiDifficulty: TMenu;
  goFirst: TMenu;
  multiplayer: TMenu;
  multiplayerChoices: TMenu;
  playAgain: TMenu;
};

const menuBtns: TGameMenuState = {
  start: {
    title: "Play Against",
    section: "start",
    listBtns: [
      {
        content: "Computer",
        aria: {
          "aria-label": "Play against Computer",
        },
        dataAttributes: { focus: "true", transitionTo: "aiDifficulty" },
        classNames: ["btn", "btn-primary", "btn-pick"],
      },
      {
        content: "Human",
        aria: {
          "aria-label": "Play against Human",
        },
        dataAttributes: {
          // transitionTo: "goFirst",
          transitionTo: "multiplayer",
          vs: "human",
        },
        classNames: ["btn", "btn-primary", "btn-pick"],
      },
    ],
  },
  aiDifficulty: {
    titleId: "ai-difficulty",
    title: "Difficulty",
    section: "aiDifficulty",
    listBtns: [
      {
        content: "Medium",
        aria: {
          "aria-describedby": "ai-difficulty",
        },
        dataAttributes: {
          focus: "true",
          difficulty: "MEDIUM",
          transitionTo: "goFirst",
          vs: "ai",
        },
        classNames: ["btn", "btn-primary", "btn-pick"],
      },
      {
        content: "Hard",
        aria: {
          "aria-describedby": "ai-difficulty",
        },
        dataAttributes: {
          difficulty: "HARD",
          transitionTo: "goFirst",
          vs: "ai",
        },
        classNames: ["btn", "btn-primary", "btn-pick"],
      },
      {
        content: "Cheater",
        aria: {
          "aria-describedby": "ai-difficulty",
          "aria-label":
            "Cheater: computer sometimes takes several cells per turn",
        },
        dataAttributes: {
          difficulty: "CHEATER",
          transitionTo: "goFirst",
          vs: "ai",
        },
        classNames: ["btn", "btn-primary", "btn-pick"],
      },
    ],
  },
  multiplayer: {
    title: "Multiplayer",
    section: "multiplayer",
    listBtns: [
      {
        content: "Local",
        aria: {
          "aria-label": "Local: Play against a Friend next to You",
        },
        dataAttributes: {
          transitionTo: "goFirst",
          focus: "true",
        },
        toolTip: "Play against a Friend next to You",
        classNames: ["btn", "btn-primary", "btn-pick"],
      },
      {
        content: "Online",
        aria: {
          "aria-label": "Online: Play against an online buddy",
        },
        dataAttributes: {
          transitionTo: "multiplayerChoices",
        },
        classNames: ["btn", "btn-primary", "btn-pick"],
      },
    ],
  },
  multiplayerChoices: {
    title: "",
    section: "multiplayerChoices",
    listBtns: [
      {
        content:
          "Join <span style='text-decoration: underline;'>Public</span> Game",
        dataAttributes: {
          open: "lobby",
          lobbyType: "enter-pre-game",
          focus: "true",
          firstItem: "true",
        },
        aria: {},
        classNames: ["btn", "btn-primary", "btn-pick", "btn-multiplayer"],
      },
      {
        content:
          "Create <span style='text-decoration: underline;'>Private</span> Game", // when clicked generates simple code to share
        dataAttributes: {
          open: "lobby",
          lobbyType: "share-private-game",
        },
        aria: {},
        classNames: ["btn", "btn-primary", "btn-pick", "btn-multiplayer"],
      },
      {
        content:
          "Join <span style='text-decoration: underline;'>Private</span> Game",
        dataAttributes: {
          open: "lobby",
          lobbyType: "join-private-game",
        },
        aria: {},
        classNames: ["btn", "btn-primary", "btn-pick", "btn-multiplayer"],
      },
    ],
  },
  goFirst: {
    title: "Who Goes First?",
    section: "goFirst",
    listBtns: [
      {
        id: "P1",
        content: "",
        aria: {
          "aria-label": "You go First",
        },
        dataAttributes: {
          playerId: "P1",
          playAgainst: "ai",
          focus: "true",
          shape: "cross",
        },
        classNames: ["btn", "btn-primary", "btn-pick", "btn-pick-player"],
      },
      {
        id: "P2",
        content: "",
        aria: {
          "aria-label": "Computer goes First",
        },
        dataAttributes: {
          playerId: "P2",
          playAgainst: "ai",
          shape: "circle",
        },
        classNames: ["btn", "btn-primary", "btn-pick", "btn-pick-player"],
      },
    ],
  },
  playAgain: {
    title: "",
    section: "playAgain",
    listBtns: [
      {
        content: "Rematch?",
        aria: {
          "aria-label": "Rematch? Play Again?",
        },
        dataAttributes: {
          playAgain: "true",
        },
        classNames: ["btn", "btn-primary", "btn-pick"],
      },
      {
        content: "Leave",
        aria: {
          "aria-label": "Leave Game",
        },
        dataAttributes: {
          transitionTo: "start",
          focus: "true",
        },
        classNames: ["btn", "btn-primary", "btn-leave"],
      },
    ],
  },
};

export default menuBtns;
