import { ESizes, EThemeBrowser } from "../enums";
import {
  IOptionsBrowser,
  ITheme,
  STORAGE_KEY_THEME_STORE,
  useThemeStore,
} from "../store";
import { getLocalStorageObject } from "../utils";

export const initializeTheme = () => {
  const { theme, textSize } = getLocalStorageObject(
    STORAGE_KEY_THEME_STORE
  ) as ITheme & IOptionsBrowser;

  useThemeStore.getState().setTheme({
    theme: theme || EThemeBrowser.SYSTEM,
    themeValue: theme === EThemeBrowser.SYSTEM ? EThemeBrowser.LIGHT : theme,
  });

  useThemeStore.getState().setTextSize(textSize || ESizes.MD);
};
