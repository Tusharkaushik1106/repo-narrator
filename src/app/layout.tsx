import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { OmniChat } from "@/components/chat/OmniChat";
import { RepoProvider } from "@/context/RepoContext";

const uiFont = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

const codeFont = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Repo Narrator",
  description: "Speak fluent repository. Gemini-powered deep repo explorer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${uiFont.variable} ${codeFont.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <RepoProvider>
          <div className="min-h-dvh bg-rn-gradient grid place-items-stretch">
            {children}
            <OmniChat />
          </div>
        </RepoProvider>
      </body>
    </html>
  );
}
