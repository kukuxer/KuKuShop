// import { Auth0Provider } from "@auth0/auth0-react";
// import {RouterProvider} from "react-router-dom";
// import {router} from "./router.tsx";
// import React from "react";
//
// const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
// const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
//
// export const withAuthAndRouter = (children: React.ReactNode) => (
//     <Auth0Provider
//         domain={auth0Domain}
//         clientId={auth0ClientId}
//         authorizationParams={{
//             redirect_uri: window.location.origin,
//             audience: `https://${auth0Domain}/api/v2/`,
//             scope: "openid profile email read:messages write:messages"
//         }}
//     >
//         <RouterProvider router={router} />
//         {children}
//     </Auth0Provider>
// );