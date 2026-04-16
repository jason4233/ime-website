export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 登入頁不需要 admin sidebar，直接渲染
  return <>{children}</>;
}
