import { useSystemTheme } from "@Hooks/useSystemTheme";
import { MuiThemeProvider } from "@Providers/MuiThemeProvider";

export function App() {
  useSystemTheme();

  return (
    <MuiThemeProvider>
      <div>Hello, worlds</div>
    </MuiThemeProvider>
  );
}
