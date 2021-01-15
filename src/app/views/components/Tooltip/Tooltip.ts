import onFocusOut, { TManualExit } from "../../../lib/onFocusOut/onFocusOut";
import { createHTMLFromString, debounce } from "../../utils";

const parentEl = document.querySelector(".tooltips-container") as HTMLElement;

export class Tooltip {
  private message = "";
  private tooltipTargetEl = {} as HTMLElement;
  private tooltipContainerEl = {} as HTMLElement;
  private tooltipShellEl = {} as HTMLElement;
  private tooltipEl = {} as HTMLElement;
  private tooltipArrowEl = {} as HTMLElement;
  private debouncedOnMousemoveTargetEl = () => {};
  private tooltipFocusOutEvent = null as TManualExit | null;
  private startinScrollX = 0;
  private startinScrollY = 0;
  private tooltipGenerated = false;
  private activatedByClick = false;
  private activatedByHover = false;
  active = false;
  disabled = false;

  constructor({
    message,
    tooltipTargetEl,
  }: {
    message: string;
    tooltipTargetEl: HTMLElement;
  }) {
    this.message = message;
    this.tooltipTargetEl = tooltipTargetEl;
    this.addTooltipTargetEvents();
  }

  private onScrollUpdatePosition = () => {
    const { scrollX, scrollY } = window;
    const x = (scrollX - this.startinScrollX) * -1;
    const y = (scrollY - this.startinScrollY) * -1;
    this.tooltipContainerEl.style.transform = `translate(${x}px, ${y}px)`;
  };

  private addScrollEventUpdatePosition() {
    const { scrollX, scrollY } = window;
    this.startinScrollX = scrollX;
    this.startinScrollY = scrollY;

    if (this.active) {
      this.onScrollUpdatePosition();
    }
    window.addEventListener("scroll", this.onScrollUpdatePosition, {
      passive: true,
    });
  }

  private removeScrollEventUpdatePosition() {
    window.removeEventListener("scroll", this.onScrollUpdatePosition);
  }

  private onClickTargetEl = () => {
    this.addTooltip({ triggeredBy: "click" });
  };

  private onMousemoveTargetEl = (e: MouseEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);

    if (
      this.tooltipTargetEl.contains(el) ||
      this.tooltipContainerEl.contains(el)
    ) {
      return;
    }
    // console.log("remove by mousemove");

    this.removeTooltip();
    document.removeEventListener(
      "mousemove",
      this.debouncedOnMousemoveTargetEl
    );
  };

  private onMouseenterTargetEl = () => {
    if (this.active) return;

    this.addTooltip({ triggeredBy: "hover" });

    this.debouncedOnMousemoveTargetEl = debounce(this.onMousemoveTargetEl, {
      time: 200,
      leading: false,
      throttle: 1000,
    });

    document.addEventListener("mousemove", this.debouncedOnMousemoveTargetEl);
  };

  private addTooltipTargetEvents() {
    this.tooltipTargetEl.addEventListener("click", this.onClickTargetEl);
    this.tooltipTargetEl.addEventListener(
      "mouseenter",
      this.onMouseenterTargetEl
    );
  }

  private removeTooltipTargetEvents() {
    this.tooltipTargetEl.removeEventListener("click", this.onClickTargetEl);
    this.tooltipTargetEl.removeEventListener(
      "mouseenter",
      this.onMouseenterTargetEl
    );
    document.removeEventListener(
      "mousemove",
      this.debouncedOnMousemoveTargetEl
    );
  }

  private toolTipInnerMarkup({ msg }: { msg: string }) {
    return `
    <div class="tooltip-shell">
      <div class="arrow arrow-up"></div>
      <div class="tooltip" role="tooltip">${msg}</div>
    </div>
    `;
  }

  private toolTipMarkup() {
    const msg = this.message;
    const innerTooltip = this.toolTipInnerMarkup({ msg });
    return `
    <div class="tooltip-container">
      ${innerTooltip}
    </div>
    `;
  }

  private onTransitionend = (e: Event) => {
    // console.log("ontransitionend");
    if (e.target !== this.tooltipContainerEl) return;

    this.tooltipContainerEl.classList.remove("active");
    this.tooltipContainerEl.removeEventListener(
      "transitionend",
      this.onTransitionend
    );
  };

  private hideTooltip() {
    // console.log("hide");
    this.tooltipContainerEl.classList.remove("visible");
    this.tooltipContainerEl.addEventListener(
      "transitionend",
      this.onTransitionend
    );
  }

  private revealTooltip() {
    // console.log("reveal");
    this.tooltipContainerEl.removeEventListener(
      "transitionend",
      this.onTransitionend
    );
    this.tooltipContainerEl.classList.add("active");
    this.tooltipContainerEl.classList.add("visible");
  }

  private createTooltip() {
    const toolTipContainer = createHTMLFromString(
      this.toolTipMarkup()
    ) as HTMLElement;
    this.tooltipContainerEl = toolTipContainer;
    this.tooltipShellEl = toolTipContainer.querySelector(
      ".tooltip-shell"
    ) as HTMLElement;
    this.tooltipEl = toolTipContainer.querySelector(".tooltip") as HTMLElement;
    this.tooltipArrowEl = toolTipContainer.querySelector(
      ".arrow"
    ) as HTMLElement;

    parentEl.appendChild(toolTipContainer);
    this.tooltipGenerated = true;
    this.calculatePosition();
    this.calculatePositionToWithinViewport();
    this.revealTooltip();
  }

  private calculatePosition() {
    const targetElBCR = this.tooltipTargetEl.getBoundingClientRect();
    const tooltipShellBCR = this.tooltipShellEl.getBoundingClientRect();
    const overlapBuffer = 3;

    this.tooltipContainerEl.style.top = `${
      targetElBCR.bottom - overlapBuffer
    }px`;
    this.tooltipContainerEl.style.left = `${
      targetElBCR.left - tooltipShellBCR.width / 2 + targetElBCR.width / 2
    }px`;
  }

  private calculatePositionToWithinViewport() {
    // position updated, now check if it's within viewport
    const tooltipShellBCR = this.tooltipShellEl.getBoundingClientRect();
    const windowInnerHeight = window.innerHeight;
    const windowInnerWidth = window.innerWidth;
    const padding = 10;

    if (tooltipShellBCR.left < 0 + padding) {
      this.tooltipEl.style.left = `${Math.abs(
        tooltipShellBCR.left - padding * 2
      )}px`;
    } else if (tooltipShellBCR.right > windowInnerWidth - padding) {
      this.tooltipEl.style.left = `${
        tooltipShellBCR.right - windowInnerWidth - padding * 2
      }px`;
    } else {
      this.tooltipEl.style.left = "";
    }

    // bottom not in view
    if (tooltipShellBCR.bottom > windowInnerHeight - padding) {
      this.tooltipShellEl.classList.add("top");
      this.tooltipArrowEl.classList.remove("arrow-up");
      this.tooltipArrowEl.classList.add("arrow-down");
      return;
    }

    // top not in view
    if (tooltipShellBCR.top < 0 + padding) {
      this.tooltipShellEl.classList.remove("top");
      this.tooltipArrowEl.classList.add("arrow-up");
      this.tooltipArrowEl.classList.remove("arrow-down");
    }
  }

  private addTooltip({
    triggeredBy = "click",
  }: { triggeredBy?: "click" | "hover" } = {}) {
    if (this.active && triggeredBy === "hover") return;
    if (!this.active) {
      this.addScrollEventUpdatePosition();
    }

    if (triggeredBy === "click" && this.active && !this.activatedByClick) {
      document.removeEventListener(
        "mousemove",
        this.debouncedOnMousemoveTargetEl
      );
      return;
    }

    this.active = true;

    if (triggeredBy === "click") this.activatedByClick = true;
    if (triggeredBy === "hover") this.activatedByHover = true;

    // console.log("bypass");

    this.tooltipFocusOutEvent = onFocusOut({
      button: this.tooltipTargetEl,
      allow: [".tooltip-shell"],
      run: () => {
        if (!this.tooltipGenerated) {
          this.createTooltip();
        } else {
          this.calculatePosition();
          this.calculatePositionToWithinViewport();
          this.revealTooltip();
        }
      },
      onExit: () => {
        this._removeTooltip();
      },
    });
    // TODO: before adding allow selectors, first click on tooltipShellEl was eaten somewhere, so nothing happend, when it should've exited according to rules of onFocusOut
  }

  updateTooltip({
    message,
    change,
  }: {
    message?: string;
    change?: (tooltip?: HTMLElement) => void;
  }) {
    if (message != null) {
      this.message = message;
      if (!this.tooltipEl) return;

      // TODO: should be textContent but renders markup as text from otherGroup
      this.tooltipEl.innerHTML = message;
    }

    if (change) {
      change(this.tooltipEl);
    }
  }

  removeTooltip() {
    if (this.tooltipFocusOutEvent == null) return;

    this.tooltipFocusOutEvent.runExit();
    this.tooltipFocusOutEvent = null;
  }

  private _removeTooltip() {
    this.hideTooltip();
    this.active = false;
    this.activatedByClick = false;
    this.activatedByHover = false;
    this.tooltipFocusOutEvent = null;

    this.removeScrollEventUpdatePosition();
    document.removeEventListener(
      "mousemove",
      this.debouncedOnMousemoveTargetEl
    );
    // console.log("remove");
    if (!this.tooltipContainerEl.isConnected) {
      // console.log("is not connected: remove");
      return;
    }
  }

  enable() {
    this.disabled = false;
    this.addTooltipTargetEvents();
  }
  disable() {
    this.active = false;
    this.disabled = true;
    this.removeTooltip();
    this.removeTooltipTargetEvents();
    this.removeScrollEventUpdatePosition();
  }
}
