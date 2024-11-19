import { EThemeBrowser } from "@Enums/browser";
import { ESizes } from "@Enums/sizes";
import {
  IOptionsBrowser,
  ITheme,
  STORAGE_KEY_THEME_STORE,
  useThemeStore,
} from "@Store/index";
import { getLocalStorageObject } from "@Utils/localStorage";

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
