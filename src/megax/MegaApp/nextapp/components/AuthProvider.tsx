"use client";

import {
  // auth0Audience,
  // auth0ClientId,
  // auth0Domain,
  // auth0Issuer,
  // frontendUrl,
  googleClientId,
} from "@/lib/config";
// import { Auth0Context, Auth0Provider } from "@auth0/auth0-react";
import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// export default function Auth0ProviderClient({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <Auth0Provider
//       domain={auth0Domain || ""}
//       clientId={auth0ClientId || ""}
//       issuer={auth0Issuer}
//       authorizationParams={{
//         redirect_uri: `${frontendUrl}/callback`,
//         audience: auth0Audience,
//       }}
//     >
//       <Auth0Context.Consumer>
//         {({ getAccessTokenSilently }: any) => {
//           deferred.resolve(getAccessTokenSilently);
//           return <>{children}</>;
//         }}
//       </Auth0Context.Consumer>
//     </Auth0Provider>
//   );
// }

// const deferred = (() => {
//   const props: Record<string,any> = {};
//   props.promise = new Promise((resolve) => props.resolve = resolve);
//   return props;
// })();

// export const getAccessToken = async () => {
//   const getToken = await deferred.promise;
//   return getToken();
// }

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
