import type { ReactNode } from "react";

import { ThemeProvider } from "@/features/preferences/theme/theme-provider";
import "@/styles/globals.css";

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="app-body">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
