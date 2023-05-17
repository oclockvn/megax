import AuthProvider from "@/components/AuthProvider";
// import { useSession, signIn, signOut } from "next-auth/react";
// import { getServerSession } from "next-auth/next"

import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MegaApp - Sign In",
  description: "A Mega App for A Company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session } = useServerSession();
  // const session = getServerSession()

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
