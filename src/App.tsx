import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSystemTheme } from "./common/hooks";
import { useThemeStore } from "./common/store";
import { navikeTheme } from "./common/themes";

export function App() {
  useSystemTheme();

  const { themeValue, textSize } = useThemeStore((state) => state);

  const MaterialTheme = createTheme(
    navikeTheme({ themeMode: themeValue, textSize })
  );

  return (
    <ThemeProvider theme={MaterialTheme}>
      <CssBaseline />
      <div>Hello, worlds</div>
    </ThemeProvider>
  );
}
