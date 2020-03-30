function IOSVersion(majorVersion: number) {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);

    if (!v) return false;

    const version = [
      parseInt(v[1], 10),
      parseInt(v[2], 10),
      parseInt(v[3] || "0", 10)
    ];

    return version[0] >= majorVersion;
  }
  return false;
}
function userAgent(pattern: RegExp) {
  // @ts-ignore
  if (process.browser) {
    if (typeof window !== "undefined" && window.navigator) {
      return !!(/*@__PURE__*/ navigator.userAgent.match(pattern));
    }
  }
}

export const IE11OrLess = userAgent(
  /(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i
);
export const Edge = userAgent(/Edge/i);
export const FireFox = userAgent(/firefox/i);
export const Safari =
  userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
export const ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);
export const IOS13 = IOSVersion(13);
export const IOS = userAgent(/iP(ad|od|hone)/i);
