import { EThemeBrowser } from "@Enums/browser";
import { useThemeStore } from "@Store/config";
import { useEffect } from "react";

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
  }, [theme, setTheme]);
};
