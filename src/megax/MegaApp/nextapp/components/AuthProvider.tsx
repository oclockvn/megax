"use client";

import { auth0ClientId, auth0Domain, authUrl } from "@/lib/config";
import { Auth0Provider } from "@auth0/auth0-react";

export default function Auth0ProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: authUrl,
      }}
    >
      {children}
    </Auth0Provider>
  );
}
