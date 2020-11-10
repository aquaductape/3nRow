import View from "../View";

class BoardView extends View {
  constructor() {
    super({ root: "" });
  }

  protected generateMarkup() {
    return `
        <div class="row" data-row="0">
          <div data-column="0" tabindex="0" aria-label="empty">
            <div class="content"></div>
          </div>
          <div data-column="1" tabindex="-1" aria-label="empty">
            <div class="content"></div>
          </div>
          <div data-column="2" tabindex="-1" aria-label="empty">
            <div class="content"></div>
          </div>
        </div>
        <div class="row" data-row="1">
          <div data-column="0" tabindex="-1" aria-label="empty">
            <div class="content"></div>
          </div>
          <div data-column="1" tabindex="-1" aria-label="empty">
            <div class="content"></div>
          </div>
          <div data-column="2" tabindex="-1" aria-label="empty">
            <div class="content"></div>
          </div>
        </div>
        <div class="row" data-row="2">
          <div data-column="0" tabindex="-1" aria-label="empty">
            <div class="content"></div>
          </div>
          <div data-column="1" tabindex="-1" aria-label="empty">
            <div class="content"></div>
          </div>
          <div data-column="2" tabindex="-1" aria-label="empty">
            <div class="content"></div>
          </div>
        </div>
        <div class="line-svg">
    `;
  }
}

export default new BoardView();
