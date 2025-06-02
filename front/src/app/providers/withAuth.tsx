import { Auth0Provider } from "@auth0/auth0-react";

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

export const withAuth = (children: React.ReactNode) => (
    <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: `https://${auth0Domain}/api/v2/`,
            scope: "openid profile email read:messages write:messages"
        }}
    >
        {children}
    </Auth0Provider>
);