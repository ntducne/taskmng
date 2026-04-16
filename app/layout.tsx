import type { Metadata } from "next";
import "./globals.css";
import { Toast } from "@heroui/react";
import SiteLayout from "@/components/siteLayout";

export const metadata: Metadata = {
  title: "NguyenDuc - Task Management",
  description: "A simple task management application built with Next.js and MongoDB.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="font-mono">
      <Toast.Provider />
      <body>
        <SiteLayout>
          {children}
        </SiteLayout>
      </body>
    </html>
  );
}
