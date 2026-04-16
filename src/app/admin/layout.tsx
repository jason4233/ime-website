import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata = {
  title: "I ME 後台管理",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
