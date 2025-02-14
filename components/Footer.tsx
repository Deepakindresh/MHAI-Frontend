// components/Footer.tsx
"use client";

import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();

  // Don't show footer on login and profile setup pages
  if (pathname === "/login" || pathname === "/profile-setup") {
    return null;
  }

  return (
    <footer className="bg-gray-100 text-gray-600 py-4 text-center mt-auto">
      <p className="text-sm">
        © {new Date().getFullYear()} DandelionAI. All rights reserved.
      </p>
    </footer>
  );
};
