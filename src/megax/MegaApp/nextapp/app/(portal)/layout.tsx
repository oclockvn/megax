// import { useSession, signIn, signOut } from "next-auth/react";
import { Inter } from "next/font/google";

import "../globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MegaApp - Welcome to Portal",
  description: "A Mega App for A Company",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session } = useSession();
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
