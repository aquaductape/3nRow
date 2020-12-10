type TMedia =
  | "(prefers-reduced-motion: reduce)"
  | "(prefers-color-scheme: light)";
type THandler = ({
  matches,
  media,
}: {
  media: string;
  matches: boolean;
}) => void;
type TMediaHandlers = {
  [key in TMedia]: THandler[];
};
class MatchMediaView {
  mediaHandlers: TMediaHandlers;
  mqls: {
    [key in TMedia]: MediaQueryList;
  };

  constructor() {
    this.mediaHandlers = {
      "(prefers-color-scheme: light)": [],
      "(prefers-reduced-motion: reduce)": [],
    };
    this.mqls = {} as any;
    this.runQueries();
  }

  private runQueries() {
    const queries: TMedia[] = [
      "(prefers-reduced-motion: reduce)",
      "(prefers-color-scheme: light)",
    ];

    queries.forEach((query) => {
      const mql = window.matchMedia(query);
      this.mqls[query] = mql;
      const handlers = this.mediaHandlers[query];

      try {
        // Chrome & Firefox
        mql.addEventListener("change", (e) => {
          handlers.forEach((handler) => handler(e));
        });
      } catch (err1) {
        try {
          // Safari
          mql.addListener((e) => {
            handlers.forEach((handler) => handler(e));
          });
        } catch (err2) {
          console.error(err2);
        }
      }
    });
  }

  private updateHTMLRoot({
    matches,
    media,
  }: {
    media: string;
    matches: boolean;
  }) {
    if (media === "(prefers-reduced-motion: reduce)") {
      if (matches) {
        document.documentElement.setAttribute(
          "data-prefers-reduced-motion",
          "true"
        );
      } else {
        document.documentElement.setAttribute(
          "data-prefers-reduced-motion",
          "false"
        );
      }
    }
  }

  fire({ media, matches }: { media: TMedia; matches: boolean }) {
    this.updateHTMLRoot({ matches, media });
    this.mediaHandlers[media].forEach((handler) => handler({ media, matches }));
  }

  subscribe({
    handler,
    media,
  }: {
    handler: ({ matches, media }: { media: string; matches: boolean }) => void;
    media: TMedia;
  }) {
    const mql = this.mqls[media];

    handler({ matches: mql.matches, media: mql.media });
    const handlers = this.mediaHandlers[media];

    handlers.push(handler);
  }
}

export default new MatchMediaView();
