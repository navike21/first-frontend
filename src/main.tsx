import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { initializeTheme } from "./common/helpers";

initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
