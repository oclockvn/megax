import Nav from "@/components/Nav";
import "../globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import StateProvider from "@/lib/store/state.provider";
import DatePickerLocalizationProvider from "@/components/providers/DatePickerLocalizationProvider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { quicksand } from "@/styles/fonts";
import MuiThemeProvider from "@/components/providers/MuiThemeProvider";

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
      <body className={quicksand.variable}>
        <MuiThemeProvider>
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
        </MuiThemeProvider>
      </body>
    </html>
  );
}
