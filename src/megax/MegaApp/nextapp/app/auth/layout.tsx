import AuthProvider from "@/components/AuthProvider";
// import { useSession, signIn, signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";

import "../globals.css";
import { Inter } from "next/font/google";
import { Session } from "next-auth";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MegaApp - Sign In",
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
  // const { data: session } = useServerSession();
  // const session = getServerSession()
  // const session = await getSession(headers().get("cookie") ?? "");

  return (
    <html lang="en">
      <body className={inter.className} data-ver="1">
        <AuthProvider>
          <h1>Sign In to your account</h1>
          {/* {JSON.stringify(session)} */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
