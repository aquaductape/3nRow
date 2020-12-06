class MatchMediaView {
  handlers: (({
    matches,
    media,
  }: {
    media: string;
    matches: boolean;
  }) => void)[];
  mqls: {
    [key: string]: MediaQueryList;
  };

  constructor() {
    this.handlers = [];
    this.mqls = {};
    this.runQueries();
  }

  runQueries() {
    const queries = ["(prefers-reduced-motion: reduce)"];

    queries.forEach((query) => {
      const mql = window.matchMedia(query);
      this.mqls[query] = mql;

      try {
        // Chrome & Firefox
        mql.addEventListener("change", (e) => {
          this.handlers.forEach((handler) => handler(e));
        });
      } catch (err1) {
        try {
          // Safari
          mql.addListener((e) => {
            this.handlers.forEach((handler) => handler(e));
          });
        } catch (err2) {
          console.error(err2);
        }
      }
    });
  }

  subscribe({
    handler,
    media,
  }: {
    handler: ({ matches, media }: { media: string; matches: boolean }) => void;
    media: "(prefers-reduced-motion: reduce)" | "(prefers-color-scheme: light)";
  }) {
    const mql = this.mqls[media];

    handler({ matches: mql.matches, media: mql.media });

    this.handlers.push(handler);
  }
}

export default new MatchMediaView();
