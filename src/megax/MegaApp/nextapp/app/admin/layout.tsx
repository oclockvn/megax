import Nav from "@/components/Nav";
import "../globals.css";
import { Roboto } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import StateProvider from "@/lib/store/state.provider";
import { getServerSession } from "next-auth";

const roboto = Roboto({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "MegaApp - Admin",
  description: "A Mega App for A Company",
};

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={roboto.className}>
        <StateProvider>
          <AuthProvider session={session}>
            <Nav />
            {children}
          </AuthProvider>
        </StateProvider>
      </body>
    </html>
  );
}
