// components/Header.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show header on login and profile setup pages
  if (pathname === "/login" || pathname === "/profile-setup") {
    return null;
  }

  return (
    <header className="bg-blue-600 text-white absolute w-full top-0 flex justify-between items-center py-4">
      <div>
        <h1
          className="text-xl font-semibold px-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          DandelionAI Chat
        </h1>
      </div>
      <div className="flex space-x-4 px-4">
        <h3
          onClick={() => router.push("/")}
          className="text-md hover:text-lg cursor-pointer transition-all"
        >
          Home
        </h3>
        <h3
          onClick={() => router.push("/profile-setup")}
          className="text-md hover:text-lg cursor-pointer transition-all"
        >
          Profile
        </h3>
        <h3
          onClick={async () => {
            await fetch("/api/logout");
            router.push("/login");
          }}
          className="text-md hover:text-lg cursor-pointer transition-all"
        >
          Logout
        </h3>
      </div>
    </header>
  );
};
