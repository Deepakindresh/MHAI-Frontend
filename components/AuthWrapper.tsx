// components/AuthWrapper.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getUserRole } from "@/utils/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { get } from "http";

export const AuthWrapper = ({
  children,
  showHeader = true,
  showFooter = true,
  chatScreen = false,
  notHomeScreen = true,
}: {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  chatScreen?: boolean;
  notHomeScreen?: boolean;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          router.push("/login");
        }
        const tempRole = await getUserRole(user.id || "");

        if (tempRole) {
          setRole(tempRole.role);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full relative w-full">
      {showHeader && (
        <Header
          chatScreen={chatScreen}
          notHomeScreen={notHomeScreen}
          room={role == "therapist"}
        />
      )}
      {children}
      {showFooter && <Footer />}
    </div>
  );
};
