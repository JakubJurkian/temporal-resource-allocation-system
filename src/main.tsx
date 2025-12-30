import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";
import { initializeUsers } from "./utils/userStorage";
import { initializeFleet } from "./utils/fleetStorage";
import "./styles/globals.scss";
import { BrowserRouter } from "react-router-dom";

// initialize data for localStorage
const bootstrapApp = () => {
  try {
    initializeUsers();
    initializeFleet();
  } catch (error) {
    console.error("Failed to initialize app data:", error);
  }
};
bootstrapApp();
// With try/catch, the whole app does not crash, the user will see rendered JSX.
// It's a good practice to control global side-effects.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
