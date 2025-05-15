// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

<<<<<<< HEAD
=======
import "react-tooltip/dist/react-tooltip.css";
>>>>>>> fc207f268e5d90bbb99f2d88b7dbae08a5f6ce66
import "@/shared/styles/font.css";
import "@/shared/styles/tailwind.css";
import "@/shared/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
