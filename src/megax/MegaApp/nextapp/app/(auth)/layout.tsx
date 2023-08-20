import Nav from "@/components/Nav";
import AuthProvider from "@/components/providers/AuthProvider";

import "../globals.css";
import MuiThemeProvider from "@/components/providers/MuiThemeProvider";
import { quicksand } from "@/styles/fonts";

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
      <body className={quicksand.variable}>
        <MuiThemeProvider>
          <AuthProvider>
            <Nav />
            <div className="container mx-auto">{children}</div>
          </AuthProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
