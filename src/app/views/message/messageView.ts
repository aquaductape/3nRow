import View from "../View";

class MessageView extends View {
  data: string;
  constructor() {
    super({ root: ".message" });
    this.data = "";
  }

  protected initQuerySelectors() {}

  protected generateMarkup() {
    return `
    <div class="message-inner">
      <span>${this.data}</span>
    </div>
    `;
  }
}

export default new MessageView();
