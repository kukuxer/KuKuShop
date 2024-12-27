import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Router>
    <Auth0Provider
      domain="dev-31chgnher118y5t3.us.auth0.com"
      clientId="4ew4XKMDORF3K8JZelh8VRQksL26F2rU"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </Router>
);
