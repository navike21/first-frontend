import { useSystemTheme } from "@Hooks/useSystemTheme";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useThemeStore } from "@Store/index";
import { navikeTheme } from "@Themes/navikeTheme";
import { ReactNode } from "react";

type MuiThemeProviderProps = {
  children: ReactNode;
};

export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
  useSystemTheme();

  const { themeValue, textSize } = useThemeStore((state) => state);

  const MaterialTheme = createTheme(
    navikeTheme({ themeMode: themeValue, textSize })
  );
  return (
    <ThemeProvider theme={MaterialTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
