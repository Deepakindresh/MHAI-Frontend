// components/Header.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show header on login and profile setup pages
  if (pathname === "/login" || pathname === "/profile-setup") {
    return null;
  }

  return (
    <header className="bg-linear-to-l from-fuchsia-600 to-violet-600 text-white absolute w-full top-0 flex justify-between items-center py-4">
      <div>
        <div
          className="text-xl font-semibold px-4 cursor-pointer flex items-center justify-center space-x-4"
          onClick={() => router.push("/")}
        >
          <div className="relative rounded-full">
            <Image
              src="/dandelion.jpg"
              alt="DandelionAI Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
              <div className="bg-green-500 h-3 w-3 opacity-90 animate-ping rounded-full"></div>
            </div>
          </div>
          <h1>DandelionAI Chat</h1>
        </div>
      </div>
      <div className="flex space-x-12 px-4 mr-8">
        <h3
          onClick={() => router.push("/")}
          className="text-lg transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer"
        >
          Home
        </h3>
        <h3
          onClick={() => router.push("/chat")}
          className="text-lg transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 cursor-pointer"
        >
          Chat
        </h3>
        <h3
          onClick={() => router.push("/profile-setup")}
          className="text-lg cursor-pointer transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        >
          Profile
        </h3>
        <h3
          onClick={async () => {
            await fetch("/api/logout");
            router.push("/login");
          }}
          className="text-lg cursor-pointer transition delay-100 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
        >
          Logout
        </h3>
      </div>
    </header>
  );
};
