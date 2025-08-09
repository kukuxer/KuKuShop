import React from "react";
import ReactDOM from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import {Auth0Provider} from "@auth0/auth0-react";
import {router} from "./providers/Router.tsx";
import "./styles/index.css";
import "./styles/app.css";
import {Provider} from "react-redux";
import {store} from "./store.ts";

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <Auth0Provider
                domain={auth0Domain}
                clientId={auth0ClientId}
                authorizationParams={{
                    redirect_uri: window.location.origin,
                    audience: `https://${auth0Domain}/api/v2/`,
                    scope: "openid profile email read:messages write:messages"
                }}
            >
                <RouterProvider router={router}/>
            </Auth0Provider>
        </Provider>
    </React.StrictMode>
);
