import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TallerPro - Sistema de Gestión de Reparaciones",
  description: "Sistema premium para la gestión de talleres de reparación de cómputo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen flex`}>
        <Sidebar />
        <main className="flex-1 bg-muted/30 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
