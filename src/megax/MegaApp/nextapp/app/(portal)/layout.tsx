// import { useSession, signIn, signOut } from "next-auth/react";
import { Inter } from "next/font/google";

import "../globals.css";
import AuthProvider from "@/components/AuthProvider";
import { headers } from "next/headers";
import { Session } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MegaApp - Welcome to Portal",
  description: "A Mega App for A Company",
};

// async function getSession(cookie: string): Promise<Session> {
//   const response = await fetch(`http://localhost:3000/api/auth/session`, {
//     headers: {
//       cookie,
//     },
//   });

//   const session = await response.json();

//   return Object.keys(session).length > 0 ? session : null;
// }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session } = useSession();
  // const session = await getSession(headers().get("cookie") ?? "");
  return (
    <html lang="en">
      <body className={inter.className} data-ver="1">
        <AuthProvider>
          <h1>Welcome</h1>
          {/* {JSON.stringify(session)} */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
