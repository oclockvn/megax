import Nav from "@/components/Nav";
import "../globals.css";
import { Roboto } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import StateProvider from "@/lib/store/state.provider";

const roboto = Roboto({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "MegaApp",
  description: "A Mega App for A Company",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StateProvider>
          <AuthProvider>
            <Nav />
            {children}
          </AuthProvider>
        </StateProvider>
      </body>
    </html>
  );
}
