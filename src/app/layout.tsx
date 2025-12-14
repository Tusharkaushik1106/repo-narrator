import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { OmniChat } from "@/components/chat/OmniChat";
import { RepoProvider } from "@/context/RepoContext";
import { FileProvider } from "@/context/FileContext";
import { Header } from "@/components/layout/Header";
import { SessionProvider } from "@/components/auth/SessionProvider";

const uiFont = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
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
  title: "gitlore",
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
        <SessionProvider>
          <RepoProvider>
            <FileProvider>
              <div className="min-h-dvh bg-rn-gradient grid place-items-stretch transform-gpu">
                <Header />
                {children}
                <OmniChat />
              </div>
            </FileProvider>
          </RepoProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
