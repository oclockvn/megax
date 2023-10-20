import Nav from "@/components/Nav";
import "../globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import StateProvider from "@/lib/store/state.provider";
import MuiThemeProvider from "@/components/providers/MuiThemeProvider";
import { quicksand } from "@/styles/fonts";
import LayoutWrapper from "@/components/LayoutWrapper";
import DatePickerLocalizationProvider from "@/components/providers/DatePickerLocalizationProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export const metadata = {
  title: "MegaApp",
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
            <ReactQueryProvider>
              <StateProvider>
                <DatePickerLocalizationProvider>
                  <AuthProvider useGuard>
                    <Nav />
                    {children}
                  </AuthProvider>
                </DatePickerLocalizationProvider>
              </StateProvider>
            </ReactQueryProvider>
          </LayoutWrapper>
        </MuiThemeProvider>
      </body>
    </html>
  );
}
