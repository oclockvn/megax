import Nav from "@/components/Nav";
import AuthProvider from "@/components/providers/AuthProvider";
import "../globals.css";
import MuiThemeProvider from "@/components/providers/MuiThemeProvider";
import { quicksand } from "@/styles/fonts";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export const metadata = {
  title: "MegaApp",
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
          <ReactQueryProvider>
            <AuthProvider>
              <Nav />
              <div className="container mx-auto">{children}</div>
            </AuthProvider>
          </ReactQueryProvider>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
