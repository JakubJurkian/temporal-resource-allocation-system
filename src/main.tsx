import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./store";
import { initializeUsers } from "./utils/userStorage";
import { initializeFleet } from "./utils/fleetStorage";
import "./styles/globals.scss";

initializeUsers();
initializeFleet();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
