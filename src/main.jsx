import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./redux/store";

import AuthInitializer from "./Components/AuthInitializer";

import "./index.css";
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <Provider store={store}>

      <BrowserRouter>

        <AuthInitializer>

          <App />

        </AuthInitializer>

      </BrowserRouter>

    </Provider>

  </React.StrictMode>
);