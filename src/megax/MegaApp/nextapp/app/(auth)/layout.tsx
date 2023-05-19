export const metadata = {
  title: "MegaApp - Sign In",
  description: "A Super App for A Company",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto">{children}</div>;
}
