"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  label: string;
  href: string;
}

interface TabLayoutProps {
  tabs: Tab[];
  children: React.ReactNode;
}

export default function TabLayout({ tabs, children }: TabLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="tab-layout">
      <div className="tab-menu">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`tab-item ${pathname === tab.href ? "tab-active" : "tab-inactive"}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="tab-content">{children}</div>
    </div>
  );
}