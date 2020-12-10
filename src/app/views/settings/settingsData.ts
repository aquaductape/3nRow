//
//
//
// FLATTEN rather than NESTED
//
// Common
//  restartBtn resetScoreBtn
// Gameplay
//  choose first move
//    list
//  player 2
//    toggle ai
//    choose ai difficulty
//      list
// UI
//  toggle enable animations
//  toggle dark mode
// About
//  name
//  about
//  github
import { svg } from "../constants/constants";
import { convertObjPropsToHTMLAttr } from "../utils/index";

type TSection = {
  id: string;
  // section and group are the same thing except if group holds a group of radio buttons or buttons since radio buttons by design should be grouped while buttons to be seperated into their own treeitem seems weird to me. if there's a group of toggles/checkboxes, section is used. Not a good design, will restructure
  type: "section" | "group" | "radio" | "group" | "button" | "toggle";
  groupType?: "radio" | "button";
  content: string;
  level?: number;
  tabindex?: number;
  children?: string[];
  dataAttributes?: {
    [key: string]: string;
  };
  aria?: {
    [key: string]: string;
  };
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  enabledBy?: string;
  classNames?: string[];
};

const settingsData: TSection[] = [
  // Common
  // {
  //   id: "common",
  //   type: "group",
  //   level: 1,
  //   content: "",
  //   children: ["restartBtn", "resetScoreBtn"],
  // },
  // {
  //   id: "restartBtn",
  //   type: "button",
  //   content: "Restart",
  //   aria: {
  //     "aria-label": "restart game",
  //   },
  // },
  // {
  //   id: "resetScoreBtn",
  //   type: "button",
  //   content: "Reset Score",
  // },
  // Gameplay
  {
    id: "gamePlay",
    level: 1,
    tabindex: 0,
    type: "section",
    content: "Gameplay",
    children: ["firstMove", "player2"],
  },
  {
    id: "firstMove",
    type: "group",
    groupType: "radio",
    content: "First Move",
    children: ["alternateRadio", "winnerRadio", "loserRadio"],
    aria: {
      "aria-label":
        "Which player makes the first move at the start of each game",
    },
  },
  {
    id: "alternateRadio",
    type: "radio",
    name: "firstMove",
    content: "Alternate",
    dataAttributes: {
      settingInput: "true",
      type: "firstMove",
      value: "alternate",
    },
    checked: true,
  },
  {
    id: "winnerRadio",
    type: "radio",
    name: "firstMove",
    content: "Winner",
    dataAttributes: {
      settingInput: "true",
      type: "firstMove",
      value: "winner",
    },
  },
  {
    id: "loserRadio",
    type: "radio",
    name: "firstMove",
    content: "Loser",
    dataAttributes: {
      settingInput: "true",
      type: "firstMove",
      value: "loser",
    },
  },
  {
    id: "player2",
    type: "section",
    content: "Player 2",
    children: ["toggleAi", "aiDifficulty"],
  },
  {
    id: "toggleAi",
    type: "toggle",
    content: "Enable as Computer",
    dataAttributes: {
      settingId: "toggleAi",
      settingInput: "true",
      type: "aiEnabled",
      toggleOthers: "true",
    },
  },
  {
    id: "aiDifficulty",
    type: "group",
    groupType: "radio",
    content: "Difficulty",
    disabled: true,
    children: ["mediumRadio", "hardRadio", "cheaterRadio"],
    dataAttributes: {
      toggledBy: "toggleAi",
    },
  },
  {
    id: "mediumRadio",
    type: "radio",
    name: "difficulty",
    content: "Medium",
    disabled: true,
    dataAttributes: {
      settingInput: "true",
      type: "aiDifficulty",
      value: "medium",
      toggledBy: "toggleAi",
    },
  },
  {
    id: "hardRadio",
    type: "radio",
    name: "difficulty",
    content: "Hard",
    disabled: true,
    dataAttributes: {
      settingInput: "true",
      type: "aiDifficulty",
      value: "hard",
      toggledBy: "toggleAi",
    },
    checked: true,
  },
  {
    id: "cheaterRadio",
    type: "radio",
    name: "difficulty",
    content: "Cheater",
    disabled: true,
    dataAttributes: {
      settingInput: "true",
      type: "aiDifficulty",
      value: "cheater",
      toggledBy: "toggleAi",
    },
  },
  // MULTIPLAYER
  // {
  //   id: "multiplayer",
  //   level: 1,
  //   type: "section",
  //   content: "Multiplayer",
  //   children: ["createGame"],
  // },
  // {
  //   id: "createGame",
  //   type: "group",
  //   groupType: "button",
  //   content: "Create Game",
  //   children: ["privateGameBtn", "publicGameBtn"],
  // },
  // {
  //   id: "privateGameBtn",
  //   level: 2,
  //   type: "button",
  //   content: "Share Private Game",
  // },
  // {
  //   id: "publicGameBtn",
  //   level: 2,
  //   type: "button",
  //   content: "Join Game With Random Player",
  // },
  // SITE
  {
    id: "site",
    level: 1,
    type: "section",
    content: "Site",
    children: ["toggleAnimations"],
    // children: ["toggleAnimations", "toggleDarkMode"],
  },
  {
    id: "toggleAnimations",
    type: "toggle",
    content: "Enable Animations",
    dataAttributes: {
      settingToggleId: "toggleAnimations",
      settingInput: "true",
      type: "animationsEnabled",
    },
    checked: true,
  },
  // {
  //   id: "toggleDarkMode",
  //   type: "toggle",
  //   content: "Enable Dark Mode",
  //   dataAttributes: {
  //     settingInput: "true",
  //     type: "darkModeEnabled",
  //   },
  // },
];

const buildSetting = ({
  parentId,
  item,
  ariaLevel,
  ariaSetsize,
  ariaPosinset,
}: {
  parentId: string;
  item: TSection;
  ariaLevel: number;
  ariaSetsize: number;
  ariaPosinset: number;
}): string => {
  switch (item.type) {
    case "button":
      return buildButton(item.content);
    case "radio":
      return buildRadio(item);
    case "toggle":
      return buildSection({
        parentId,
        item: { ...item, content: buildToggle(item) },
        ariaLevel,
        ariaSetsize,
        ariaPosinset,
      });
    case "group":
    case "section":
      return buildSection({
        parentId,
        item,
        ariaLevel,
        ariaSetsize,
        ariaPosinset,
      });
  }
};

const buildSection = ({
  parentId,
  item,
  ariaLevel,
  ariaSetsize,
  ariaPosinset,
}: {
  parentId: string;
  item: TSection;
  ariaLevel: number;
  ariaSetsize: number;
  ariaPosinset: number;
}) => {
  const ariaExpanded = item.type === "section" ? 'aria-expanded="true"' : "";
  const parentIdStr =
    item.id !== parentId ? `data-parent-setting-id="${parentId}"` : "";
  let children = "";
  let childrenGroup = "";
  let siblings = "";
  let directChild = "";

  if (item.children) {
    children = item.children
      .map((childId, idx) => {
        const child = settingsData.find((setting) => setting.id === childId)!;
        const ariaSetsize =
          item.type === "section"
            ? item.children!.length
            : child.children
            ? child.children.length
            : 0;

        return buildSetting({
          parentId: item.id,
          item: child,
          ariaLevel: ariaLevel + 1,
          ariaSetsize,
          ariaPosinset: idx + 1,
        });
      })
      .join("");
  }

  if (item.type === "section") {
    siblings = children;
    directChild = `
      <div class="title">
        ${item.content}
      </div>
      ${childrenGroup}
  `;
  }

  if (item.type === "toggle") {
    directChild = `${item.content}${childrenGroup}`;
  }

  if (item.type === "group") {
    // buildGroup
    directChild = buildGroup({
      parentId: item.id,
      children,
      item,
      level: ariaLevel + 1,
    });
  }

  return `
    <div
     ${parentIdStr}
     data-setting-id="${item.id}"
     class="section"
     role="treeitem"
     ${ariaExpanded}
     aria-posinset="${ariaPosinset}"
     aria-setsize="${ariaSetsize}"
     aria-level="${ariaLevel}"
     data-level="${ariaLevel}"
     tabindex="${item.tabindex == null ? "-1" : item.tabindex}"
    >
      ${directChild}
    </div>
    ${siblings}
  `;
};

const buildToggle = (item: TSection) => {
  const { content, dataAttributes, aria, checked } = item;
  const dataAttr = convertObjPropsToHTMLAttr({
    type: "data",
    obj: dataAttributes!,
  });
  const ariaAttr = convertObjPropsToHTMLAttr({
    type: "aria",
    obj: aria!,
  });

  return toggleMarkup({
    label: content,
    aria: ariaAttr!,
    dataAttributes: dataAttr!,
    checked: checked,
  });
};

const buildGroup = (props: {
  parentId: string;
  children: string;
  item: TSection;
  level: number;
}) => {
  switch (props.item.groupType!) {
    case "button":
      return buildButtonGroup(props);
    case "radio":
      return buildRadioGroup(props);
  }
};

const buildButtonGroup = ({
  parentId,
  children,
  item,
  level,
}: {
  parentId: string;
  children: string;
  item: TSection;
  level: number;
}) => {
  return `
    <div class="group">
      <div class="title">
        ${item.content}
      </div>
      ${children}
    </div>
    `;
};

const buildRadioGroup = ({
  parentId,
  children,
  item,
  level,
}: {
  parentId: string;
  children: string;
  item: TSection;
  level: number;
}) => {
  let ariaAttributes = convertObjPropsToHTMLAttr({
    type: "aria",
    obj: item.aria!,
  });
  ariaAttributes = ariaAttributes || `aria-label="${item.content}"`;
  const headingId = "radiogroup" + item.id;
  const heading = `<h${
    level! + 1
  } id="${headingId}" class="title" ${ariaAttributes}>${item.content}</h${
    level! + 1
  }>`;
  const disabled = item.disabled ? "disabled" : "";
  const toggledById = item.dataAttributes && item.dataAttributes["toggledBy"];
  const toggledBy = toggledById ? `data-toggled-by="${toggledById}"` : "";

  return `
      <div role="radiogroup" class="radio-group group ${disabled}" ${toggledBy} aria-labelledby="${headingId}" >
        ${heading}
        ${children}
      </div>
    `;
};

const buildRadio = (item: TSection) => {
  const { content, aria, checked, disabled, dataAttributes, name } = item;
  const dataAttr = convertObjPropsToHTMLAttr({
    type: "data",
    obj: dataAttributes!,
  });
  const ariaAttr = convertObjPropsToHTMLAttr({
    type: "aria",
    obj: aria!,
  });
  const toggledById = dataAttributes && dataAttributes["toggledBy"];
  const toggledBy = toggledById ? `data-toggled-by="${toggledById}"` : "";

  return radioMarkup({
    value: content,
    checked: checked!,
    disabled: disabled!,
    aria: ariaAttr!,
    dataAttributes: dataAttr,
    name: name!,
    toggledBy,
  });
};

const buildButton = (content: string) => {
  return `
  <button>${content}</button>
  `;
};

export const buildSettings = () => {
  const topLevelData = settingsData.filter((setting) => setting.level === 1);
  return topLevelData
    .map((setting, idx) =>
      buildSetting({
        parentId: setting.id,
        item: setting,
        ariaLevel: 1,
        ariaSetsize: topLevelData.length,
        ariaPosinset: idx + 1,
      })
    )
    .join("");
};

const radioMarkup = ({
  value,
  checked,
  name,
  disabled,
  dataAttributes,
  aria,
  toggledBy,
}: {
  value: string;
  name: string;
  checked: boolean;
  disabled: boolean;
  dataAttributes: string;
  aria: string;
  toggledBy?: string;
}) => {
  const valueCapitalize = value[0].toUpperCase() + value.slice(1).toLowerCase();
  const checkedVal = checked ? "checked" : "";
  const disabledVal = disabled ? "disabled" : "";
  const radioIcon = svg.radio;

  return `
    <div class="radio ${disabledVal}" ${dataAttributes}>
      <input type="radio" id="for-${value}" name="${name}" ${toggledBy} ${checkedVal} ${disabledVal}>
      <label for="for-${value}" ${aria}>
        <span class="radio-icon">${radioIcon}</span>
        <span class="label-content">
          ${valueCapitalize}
        </span> 
      </label>
    </div>
    `;
};

const toggleMarkup = ({
  label,
  dataAttributes,
  aria,
  disabled,
  checked,
}: {
  label: string;
  dataAttributes: string;
  aria: string;
  disabled?: boolean;
  checked?: boolean;
}) => {
  const disabledVal = disabled ? "disabled" : "";
  const checkedVal = checked ? "checked" : "";

  return `
  <div class="toggle-container">
    <label class="toggle-control" ${aria}>
    ${label}
      <span class="toggle-container">
        <input ${dataAttributes}  type="checkbox" ${checkedVal} ${disabledVal}>
        <span class="control"></span>
      </span>
    </label>
  </div>
  `;
};
