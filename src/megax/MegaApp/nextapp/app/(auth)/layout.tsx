import Nav from "@/components/Nav";
import { Roboto } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";

import "../globals.css";

const roboto = Roboto({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "MegaApp - Sign In",
  description: "A Super App for A Company",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AuthProvider>
          <Nav />
          <div className="container mx-auto">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
