export const metadata = {
  title: "MegaApp",
  description: "A Super App for A Company",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto">{children}</div>;
}
