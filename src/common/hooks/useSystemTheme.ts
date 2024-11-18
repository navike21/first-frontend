import { useEffect } from "react";
import { useThemeStore } from "../store";
import { EThemeBrowser } from "../enums";

export const useSystemTheme = () => {
  const { setTheme, theme } = useThemeStore((state) => state);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === EThemeBrowser.SYSTEM)
        setTheme({
          theme: EThemeBrowser.SYSTEM,
          themeValue: e.matches ? EThemeBrowser.DARK : EThemeBrowser.LIGHT,
        });
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [setTheme]);
};
