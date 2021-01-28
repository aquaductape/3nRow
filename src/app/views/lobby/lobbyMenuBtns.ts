import { TLobbyType } from "./lobbyView";
import { TJoinBy } from "./preGameView";

type TBtn = {
  id?: string;
  type?: "button" | "link";
  content: string;
  dataAttributes: {
    lobbyType?: TLobbyType;
    joinBy?: TJoinBy;
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

const lobbyMenuBtns: TMenu = {
  title: "Lobby", // lobby-room-choices-title
  section: "multiplayerChoices",
  listBtns: [
    {
      content: "Battle Random Player",
      dataAttributes: {
        lobbyType: "enter-pre-game",
        joinBy: "public",
        focus: "true",
        firstItem: "true",
      },
      aria: {
        "aria-label":
          "Join Public Game. You'll be matched with a random opponent",
      },
      classNames: ["btn", "btn-primary", "btn-pick", "btn-multiplayer"],
    },
    {
      content: "Join <span style='text-decoration: underline;'>Private</span>",
      dataAttributes: {
        lobbyType: "join-private-game",
        joinBy: "private",
      },
      aria: {
        "aria-label": "join private game",
      },
      classNames: ["btn", "btn-primary", "btn-pick", "btn-multiplayer"],
    },
    {
      content:
        "Create <span style='text-decoration: underline;'>Private</span>",
      dataAttributes: {
        lobbyType: "create-private-game",
        joinBy: "created-private",
      },
      aria: {
        "aria-label": "create private game",
      },
      classNames: ["btn", "btn-primary", "btn-pick", "btn-multiplayer"],
    },
  ],
};

export default lobbyMenuBtns;
