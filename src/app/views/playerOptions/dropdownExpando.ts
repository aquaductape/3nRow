import { round } from "../../utils";
import { clamp, ease, easeInOutQuad } from "../playerOptions/animation";

type TAnimationStateOptions = {
  interrupted: boolean;
  running: boolean;
};

type TAnimationState = {
  running: boolean;
  collapse: TAnimationStateOptions;
  expand: TAnimationStateOptions;
};

type CustomStyle = Partial<
  Exclude<Omit<CSSStyleDeclaration, "length" | "parentRule">, number>
>;

type TCustomKeyFrame = {
  offset: number;
} & CustomStyle;

let animationId = 1;

// Safari has issue where animation applied to element is cached and cannot be updated. Workaround is setting element style to a different animation name or a more expensive route if you want to keep the animation name, is to "refresh" the element (remove from dom, then append it back).
const updateId = (id: number) => {
  return (id = (id + 1) % 5);
};

export class DropdownExpando {
  private id: string;
  private animationMode: "css" | "webAPI" = "css";
  private webAPIAnimationReverseMode: "reverse" | "commitStyles" = "reverse";
  private maskEl: HTMLElement = {} as any;
  private innerEl: HTMLElement = {} as any;
  private expandMaskKeyframes: TCustomKeyFrame[] = [];
  private expandInnerKeyframes: TCustomKeyFrame[] = [];
  private collapseMaskKeyframes: TCustomKeyFrame[] = [];
  private collapseInnerKeyframes: TCustomKeyFrame[] = [];
  private expandMaskInterruptedKeyframes: TCustomKeyFrame[] = [];
  private expandInnerInterruptedKeyframes: TCustomKeyFrame[] = [];
  private collapseMaskInterruptedKeyframes: TCustomKeyFrame[] = [];
  private collapseInnerInterruptedKeyframes: TCustomKeyFrame[] = [];
  private duration = 600;
  private interruptedDuration = 0;
  private maskAnimation: Animation | null = null;
  private innerAnimation: Animation | null = null;
  private animationPlayState: TAnimationState = {
    running: false,
    collapse: {
      interrupted: false,
      running: false,
    },
    expand: {
      interrupted: false,
      running: false,
    },
  };
  private onEnd?: (props: TAnimationState) => void = () => {};
  private styleSheetInit: boolean = false;
  private interruptedId = 1;
  private styleSheetName = "dropdown-expando-animation";
  private styleSheetNameInterrupted = `${this.styleSheetName}-interrupted`;
  private collapsedMaskWidth = 0;
  private collapsedMaskHeight = 0;
  private expandedScale = 0;
  private expanded = false;

  constructor({
    id,
    maskEl,
    innerEl,
  }: {
    id: string;
    maskEl: HTMLElement;
    innerEl: HTMLElement;
  }) {
    this.id = id;
    this.styleSheetNameInterrupted += `-${id}`;
    this.maskEl = maskEl;
    this.innerEl = innerEl;
    this.animationMode = "css";
    this.webAPIAnimationReverseMode = "reverse";

    //     if ("animate" in maskEl && typeof new Animation().reverse === "function") {
    //       this.animationMode = "webAPI";
    //
    //       // if (typeof new Animation().reverse === "function") {
    //       //   this.webAPIAnimationReverseMode = "commitStyles";
    //       // }
    //     }
  }

  calculate({ updateStylesheet = true }: { updateStylesheet?: boolean } = {}) {
    const innerElBCR = this.innerEl.getBoundingClientRect();
    const maskElBCR = this.maskEl.getBoundingClientRect();

    const expandedWidth = innerElBCR.width;
    const expandedHeight = innerElBCR.height;

    const collapsedWidth = maskElBCR.width;
    const collapsedHeight = maskElBCR.height;
    this.collapsedMaskWidth = maskElBCR.width;
    this.collapsedMaskHeight = maskElBCR.height;

    const exRadius = Math.sqrt(
      expandedWidth * expandedWidth + expandedHeight * expandedHeight
    );
    const colRadius = collapsedWidth * 0.5;

    const scale = (exRadius - colRadius) / colRadius;
    this.expandedScale = scale;

    // Set initial transformOrigin.
    this.maskEl.style.transformOrigin = `${collapsedWidth / 2}px ${
      collapsedHeight / 2
    }px`;
    this.innerEl.style.transformOrigin = `${collapsedWidth / 2}px ${
      collapsedHeight / 2
    }px`;

    for (let i = 0; i <= 100; i++) {
      const step = easeInOutQuad(i / 100);
      const offset = i / 100;

      // expand keyframes
      this.appendKeyFrames({
        step,
        offset,
        start: 1,
        end: scale,
        innerAnimation: this.expandInnerKeyframes,
        outerAnimation: this.expandMaskKeyframes,
      });

      // collapse keyframes
      this.appendKeyFrames({
        step,
        offset,
        start: scale,
        end: 1,
        innerAnimation: this.collapseInnerKeyframes,
        outerAnimation: this.collapseMaskKeyframes,
      });
    }

    if (this.animationMode === "css" && updateStylesheet) {
      this.addKeyframesToStyleSheet();
    }

    this.removeForwardFillOnFinishedExpanded();
  }

  play({
    mode,
    onEnd,
    onStart,
  }: {
    onStart?: Function;
    onEnd?: (props: TAnimationState) => void;
    mode: "collapse" | "expand";
  }) {
    console.log(mode);
    if (
      this.animationPlayState[mode].running ||
      this.animationPlayState[mode].interrupted
    ) {
      return;
    }

    this.pauseAnimation();
    onStart && onStart();
    this.onEnd = onEnd;

    if (this.animationMode === "webAPI") {
      this.playWebAPIAnimation({ mode });
      return;
    }

    if (this.animationMode === "css") {
      this.playCSSAnimation({ mode });
      return;
    }
  }

  private WAAnimationCollapse() {
    this.animationPlayState.collapse.running = true;

    this.maskAnimation = this.maskEl.animate(
      this.collapseMaskKeyframes as any,
      {
        fill: "forwards",
        easing: "linear",
        duration: this.duration,
      }
    );

    this.innerAnimation = this.innerEl.animate(
      this.collapseInnerKeyframes as any,
      {
        fill: "forwards",
        easing: "linear",
        duration: this.duration,
      }
    );

    this.maskAnimation.onfinish = () => {
      this.finishedDropdown();
    };
  }

  private WAAnimationExpand() {
    this.animationPlayState.expand.running = true;

    this.maskAnimation = this.maskEl.animate(this.expandMaskKeyframes as any, {
      fill: "forwards",
      easing: "linear",
      duration: this.duration,
    });

    this.innerAnimation = this.innerEl.animate(
      this.expandInnerKeyframes as any,
      {
        fill: "forwards",
        easing: "linear",
        duration: this.duration,
      }
    );

    this.maskAnimation.onfinish = () => {
      this.finishedDropdown();
    };
  }

  private playWebAPIAnimation({
    mode,
    onStart,
  }: {
    onStart?: Function;
    mode: "collapse" | "expand";
  }) {
    if (mode === "collapse") {
      this.WAAnimationCollapse();
      return;
    }
    if (mode === "expand") {
      this.WAAnimationExpand();
      return;
    }
  }

  private updatePlayState(
    mode: "collapse" | "expand",
    { interrupted, running }: { interrupted: boolean; running: boolean }
  ) {
    const getOppositeMode = () => {
      if (mode === "collapse") {
        return "expand";
      }
      return "collapse";
    };
    const oppositeMode = getOppositeMode();

    this.animationPlayState[mode].interrupted = interrupted;
    this.animationPlayState[mode].running = interrupted;

    this.animationPlayState[oppositeMode].interrupted = false;
    this.animationPlayState[oppositeMode].running = false;
  }

  private playCSSAnimation({
    mode,
    onStart,
  }: {
    onStart?: Function;
    mode: "collapse" | "expand";
  }) {
    let maskAnimationName =
      mode === "expand"
        ? `ExpandMaskAnimation-${animationId}`
        : `CollapseMaskAnimation-${animationId}`;
    let innerAnimationName =
      mode === "expand"
        ? `ExpandInnerAnimation-${animationId}`
        : `CollapseInnerAnimation-${animationId}`;

    let duration = this.duration;

    if (this.animationPlayState.running) {
      maskAnimationName =
        mode === "expand"
          ? `InterruptedExpandMaskAnimation-${this.interruptedId}`
          : `InterruptedCollapseMaskAnimation-${this.interruptedId}`;
      innerAnimationName =
        mode === "expand"
          ? `InterruptedExpandInnerAnimation-${this.interruptedId}`
          : `InterruptedCollapseInnerAnimation-${this.interruptedId}`;

      this.useInterruptedKeyframes({ mode });
      duration = this.interruptedDuration;
      this.updatePlayState(mode, { running: false, interrupted: true });
    }

    this.updatePlayState(mode, { running: true, interrupted: false });

    this.maskEl.style.overflow = "";
    this.maskEl.style.animation = `${maskAnimationName} ${duration}ms linear forwards`;
    this.innerEl.style.animation = `${innerAnimationName} ${duration}ms linear forwards`;
    this.maskEl.style.animationPlayState = "running";
    this.innerEl.style.animationPlayState = "running";

    // this.finishedDropdown = this.finishedDropdown.bind(this);

    this.maskEl.addEventListener("animationend", this.finishedDropdown);
    this.animationPlayState.running = true;
  }

  private pauseAnimation() {
    if (!this.animationPlayState.running) return;

    if (this.animationMode === "css") {
      this.maskEl.style.animationPlayState = "paused";
      this.innerEl.style.animationPlayState = "paused";

      this.maskEl.removeEventListener("animationend", this.finishedDropdown);
    }

    if (this.animationMode === "webAPI") {
      this.maskAnimation?.pause();
      this.innerAnimation?.pause();
    }
  }

  private finishedDropdown = (e?: AnimationEvent) => {
    if (this.animationMode === "css" && e) {
      const target = e.target as HTMLElement;
      if (target !== this.maskEl && target !== this.innerEl) return;
    }
    console.log("fire");

    this.onEnd && this.onEnd(this.animationPlayState);

    if (this.animationPlayState.expand) {
      this.expanded = true;
    } else {
      this.expanded = false;
    }

    this.animationPlayState = {
      running: false,
      collapse: { interrupted: false, running: false },
      expand: { interrupted: false, running: false },
    };

    if (this.animationMode === "css") {
      this.maskEl.removeEventListener("animationend", this.finishedDropdown);
    }
  };

  useInterruptedKeyframes({ mode }: { mode: "collapse" | "expand" }) {
    const maskInterruptedKeyframes =
      mode === "collapse"
        ? this.collapseMaskInterruptedKeyframes
        : this.expandMaskInterruptedKeyframes;
    const innerInterruptedKeyframes =
      mode === "collapse"
        ? this.collapseInnerInterruptedKeyframes
        : this.expandInnerInterruptedKeyframes;
    const maskKeyframeName =
      mode === "collapse"
        ? "InterruptedCollapseMaskAnimation"
        : "InterruptedExpandMaskAnimation";
    const innerKeyframeName =
      mode === "collapse"
        ? "InterruptedCollapseInnerAnimation"
        : "InterruptedExpandInnerAnimation";

    const startingScale =
      this.maskEl.getBoundingClientRect().width / this.collapsedMaskWidth;

    this.interruptedDuration =
      this.duration * (startingScale / this.expandedScale);

    if (mode === "expand") {
      this.interruptedDuration = this.duration - this.interruptedDuration;
    }

    const start = startingScale;
    const end = mode === "collapse" ? 1 : this.expandedScale;

    for (let i = 0; i <= 100; i++) {
      const step = easeInOutQuad(i / 100);
      const offset = i / 100;
      this.appendKeyFrames({
        step,
        offset,
        start,
        end,
        innerAnimation: innerInterruptedKeyframes,
        outerAnimation: maskInterruptedKeyframes,
      });
    }

    const styleSheet = document.getElementById(this.styleSheetNameInterrupted)!;
    styleSheet.textContent = `
    @keyframes ${maskKeyframeName}-${this.interruptedId} {
      ${this.keyframesToString(maskInterruptedKeyframes)}
    }
    @keyframes ${innerKeyframeName}-${this.interruptedId} {
      ${this.keyframesToString(innerInterruptedKeyframes)}
    }
    `;

    // reset
    this.collapseMaskInterruptedKeyframes = [];
    this.collapseInnerInterruptedKeyframes = [];
    this.expandMaskInterruptedKeyframes = [];
    this.expandInnerInterruptedKeyframes = [];
  }

  private keyframesToString(keyframesArr: TCustomKeyFrame[]) {
    return keyframesArr
      .map(({ offset, transform }) => {
        offset = Math.round(offset * 100);

        return `
          ${offset}% {
            transform: ${transform}
          }
        `;
      })
      .join("");
  }

  private addKeyframesToStyleSheet() {
    const styleSheet = document.getElementById("dropdown-expando-animation")!;

    styleSheet.textContent = `
        @keyframes ExpandMaskAnimation-${animationId} {
          ${this.keyframesToString(this.expandMaskKeyframes)}
        }

        @keyframes ExpandInnerAnimation-${animationId} {
          ${this.keyframesToString(this.expandInnerKeyframes)}
        }

        @keyframes CollapseMaskAnimation-${animationId} {
          ${this.keyframesToString(this.collapseMaskKeyframes)}
        }

        @keyframes CollapseInnerAnimation-${animationId} {
          ${this.keyframesToString(this.collapseInnerKeyframes)}
        }
      `;
  }

  private appendKeyFrames({
    offset,
    step,
    start,
    end,
    outerAnimation,
    innerAnimation,
  }: {
    offset: number;
    step: number;
    start: number;
    end: number;
    outerAnimation: TCustomKeyFrame[];
    innerAnimation: TCustomKeyFrame[];
  }) {
    const scale = start + (end - start) * step;
    const invScale = 1 / scale;

    outerAnimation.push({ transform: `scale(${scale})`, offset });
    innerAnimation.push({ transform: `scale(${invScale})`, offset });
  }

  removeForwardFillOnFinishedExpanded() {
    if (this.expanded) {
      this.maskEl.style.overflow = "visible";
      this.maskEl.style.animation = "none";
      this.innerEl.style.animation = "none";
    }
  }
}

const findKeyframesRule = (rule: string): CSSKeyframesRule | null => {
  //get object of our rule
  const ss = document.styleSheets; // get array of stylesheets
  for (let i = 0; i < ss.length; ++i) {
    // loop thru stylesheets
    for (let j = 0; j < ss[i].cssRules.length; ++j) {
      // loop thru rules
      // @ts-ignore
      if (ss[i].cssRules[j].name == rule) {
        //if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE)  //***update WEBKIT***
        // @ts-ignore
        return ss[i].cssRules[j];
      }
    }
  }
  return null;
};
