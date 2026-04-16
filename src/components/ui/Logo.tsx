import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "dark" | "light";
  showSlogan?: boolean;
  className?: string;
}

export function Logo({ variant = "dark", showSlogan = false, className = "" }: LogoProps) {
  // 深色背景：加亮色陰影讓紫色字更明顯
  // 淺色背景：加暗色陰影增加對比
  const filterStyle = variant === "light"
    ? { filter: "drop-shadow(0 0 8px rgba(123, 47, 190, 0.5)) drop-shadow(0 0 2px rgba(255, 255, 255, 0.6))" }
    : { filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))" };

  return (
    <Link href="/" className={`group inline-flex flex-col items-start ${className}`}>
      <Image
        src="/images/logo-ime.png"
        alt="I ME — Exosome Beauty for you"
        width={160}
        height={50}
        className="h-10 w-auto object-contain transition-all duration-300"
        style={filterStyle}
        priority
      />
      {showSlogan && (
        <span className={`font-elegant italic text-[0.6rem] tracking-[0.12em] -mt-0.5 transition-colors duration-300
          ${variant === "dark" ? "text-night/30" : "text-ivory/30"}`}>
          Exosome Beauty for you
        </span>
      )}
    </Link>
  );
}
