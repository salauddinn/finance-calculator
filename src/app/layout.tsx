import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/features/preferences/theme/theme-provider";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Finance Calculator India",
  description:
    "Plan loans, SIP growth, and fixed deposits with clear assumptions for everyday financial decisions.",
  applicationName: "Finance Calculator India",
  keywords: ["finance calculator", "home loan", "personal loan", "SIP", "fixed deposit"],
  openGraph: {
    title: "Finance Calculator India",
    description:
      "Plan loans, SIP growth, and fixed deposits with clear assumptions for everyday financial decisions.",
    type: "website"
  }
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="app-body">
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
