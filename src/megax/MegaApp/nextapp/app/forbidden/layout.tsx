import "../globals.css";
import MuiThemeProvider from "@/components/providers/MuiThemeProvider";
import { quicksand } from "@/styles/fonts";

export const metadata = {
  title: "MegaApp",
  description: "403 - Forbidden",
};

export default async function ForbiddenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={quicksand.variable}>
        <MuiThemeProvider>
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
