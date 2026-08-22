import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TaskFlow",
    template: "%s | TaskFlow",
  },
  description:
    "Organize projetos e tarefas em um quadro Kanban simples, acessível e responsivo.",
  applicationName: "TaskFlow",
  authors: [
    {
      name: "Jorge Alberto Pires Junior",
    },
  ],
  creator: "Jorge Alberto Pires Junior",
  keywords: [
    "TaskFlow",
    "Kanban",
    "gestão de tarefas",
    "gestão de projetos",
    "produtividade",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main-content"
          className="fixed top-4 left-4 z-50 -translate-y-24 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white shadow-lg transition-transform focus:translate-y-0 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 focus:outline-none"
        >
          Pular para o conteúdo
        </a>

        {children}
      </body>
    </html>
  );
}
