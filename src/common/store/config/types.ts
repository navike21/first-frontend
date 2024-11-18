import { EThemeBrowser, ESizes } from "../../enums";

export type TThemeBrowser = Exclude<EThemeBrowser, EThemeBrowser.SYSTEM>;

export interface ITheme {
  theme: EThemeBrowser;
  themeValue: TThemeBrowser;
}

export interface IOptionsBrowser {
  textSize: ESizes;
}

export interface IThemeStore extends ITheme, IOptionsBrowser {
  toggleTheme: () => void;
  setTheme: (params: ITheme) => void;
  setTextSize: (size: ESizes) => void;
}
