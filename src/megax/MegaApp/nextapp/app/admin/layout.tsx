import Nav from "@/components/Nav";
import "../globals.css";
import { Roboto } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import StateProvider from "@/lib/store/state.provider";
import DatePickerLocalizationProvider from "@/components/providers/DatePickerLocalizationProvider";
import LayoutWrapper from "@/components/LayoutWrapper";

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
  return (
    <html lang="en">
      <body className={roboto.className}>
        <LayoutWrapper>
          <StateProvider>
            <DatePickerLocalizationProvider>
              <AuthProvider useGuard>
                <Nav />
                {children}
              </AuthProvider>
            </DatePickerLocalizationProvider>
          </StateProvider>
        </LayoutWrapper>
      </body>
    </html>
  );
}
