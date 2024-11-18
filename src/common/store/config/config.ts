import { IThemeStore } from "./types";
import { ESizes, EThemeBrowser } from "../../enums";
import { createStore, getSystemTheme } from "../../utils";
import { STORAGE_KEY_THEME_STORE } from "./constant";

export const useThemeStore = createStore<IThemeStore>(
  (set, get) => ({
    theme: EThemeBrowser.SYSTEM,
    themeValue: getSystemTheme(),
    textSize: ESizes.MD,
    toggleTheme: () => {
      const { theme } = get();
      const newTheme =
        theme === EThemeBrowser.LIGHT
          ? EThemeBrowser.DARK
          : EThemeBrowser.LIGHT;

      set({
        theme: newTheme,
        themeValue: newTheme,
      });
    },
    setTheme: ({ theme, themeValue }) => {
      set({
        theme,
        themeValue:
          theme === EThemeBrowser.SYSTEM ? getSystemTheme() : themeValue,
      });
    },
    setTextSize: (size) => {
      set({
        textSize: size,
      });
    },
  }),
  {
    name: STORAGE_KEY_THEME_STORE,
  }
);
