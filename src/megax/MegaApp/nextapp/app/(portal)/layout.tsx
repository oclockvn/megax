export const metadata = {
  title: "MegaApp - Welcome to Portal",
  description: "A Mega App for A Company",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <h1>Welcome</h1>
      {children}
    </main>
  );
}
