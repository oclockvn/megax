export const metadata = {
  title: "MegaApp - Sign In",
  description: "A Mega App for A Company",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
