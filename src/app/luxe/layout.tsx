import "./luxe-overrides.css";
import { LuxeBodyClass } from "@/components/luxe/LuxeBodyClass";

export default function LuxeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LuxeBodyClass />
      {children}
    </>
  );
}
