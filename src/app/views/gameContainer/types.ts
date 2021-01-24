export type TViews = {
  lobbyView: TViewProps<TLobbyViewProps>;
  gameMenuView: TViewProps<TGameMenuViewProps>;
  playerOptionsView: TViewProps<TPlayerOptionsViewProps>;
  boardView: TViewProps<TBoardViewProps>;
  settingsView: TViewProps<TSettingsViewProps>;
};

type TViewProps<T extends keyof any> = {
  /** Default `false`. Will run if View component has generated in DOM. Prevents unnecessary DOM lookup if View component is not in DOM */
  present: boolean;
  props: TQuery<T>;
};

type TQuery<T extends keyof any> = {
  [key in T]: {
    el?: HTMLElement | HTMLElement[] | null;
    queryAll?: boolean;
    selector: string;
  };
};

type TLobbyViewProps =
  | "playerPickSkinCountDown"
  | "pickSkinBtnsGroup"
  | "declarePlayersShape"
  | "declarePlayersDeclaration"
  | "pickSkin"
  | "pickSkinTitle"
  | "pickSkinBtnsGroup"
  | "pickSkinItems";
type TGameMenuViewProps =
  | "gameMenu"
  | "gameMenuBtns"
  | "gameMenuBtnPickPlayer"
  | "gameOverPlayerShape"
  | "gameOverPlayerResult"
  | "navigationBackBtn";
type TPlayerOptionsViewProps =
  | "playerBtnGroup"
  | "playerBtns"
  | "p1BtnOptions"
  | "fakePlayerBtns"
  | "playerDropdowns"
  | "playerDropdownInners"
  | "playerDropdownShells"
  | "playerDropdownShellShadows"
  | "playerDropdownMasks"
  | "playerIndicators";
type TBoardViewProps = "rows" | "cells" | "board" | "boardBackground";
type TSettingsViewProps = "settingsBtn" | "settings";
