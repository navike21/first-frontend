import { EThemeBrowser } from "../enums";
import { TThemeBrowser } from "../store";

export const getSystemTheme = (): TThemeBrowser => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? EThemeBrowser.DARK
    : EThemeBrowser.LIGHT;
};
