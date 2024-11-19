import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { initializeTheme } from "@Helpers/initializeTheme.ts";

initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
