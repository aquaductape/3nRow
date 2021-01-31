import model from "../model/model";
import playerBtnGroupView from "../views/playerOptions/playerBtnGroupView";
import settingsView from "../views/settings/settingsView";

export type TControlSettings = (prop: {
  type: "aiEnabled" | "aiDifficulty" | "firstMove";
  value: string | boolean;
  updatedFromSettingsView?: boolean;
}) => void;
export const controlSettings: TControlSettings = ({
  type,
  value,
  updatedFromSettingsView = false,
}) => {
  if (type === "aiDifficulty") {
    model.setAiDifficulty({
      id: "P2",
      difficulty: value as string,
    });
  }
  if (type === "aiEnabled") {
    playerBtnGroupView.updatePlayAgainst({
      type: value ? "vsAi" : "vsHuman",
    });
    model.setPlayerAsHumanOrAI({
      id: "P2",
      ai: value as boolean,
    });
  }

  if (type === "firstMove") {
    model.setFirstMove(value as string);
  }

  if (!updatedFromSettingsView) {
    settingsView.updateSettings({ type, value });
  }
};
