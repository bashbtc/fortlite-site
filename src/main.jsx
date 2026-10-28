import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";
import "./bridge-design.css";
import "./motion.css";
import "./flow-transitions.css";
import "./selected-direction.css";
import "./unified.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
