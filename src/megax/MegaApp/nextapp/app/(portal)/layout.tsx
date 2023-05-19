export const metadata = {
  title: "MegaApp - Welcome to Portal",
  description: "A Super App for A Company",
};

export default function PortalLayout({
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
