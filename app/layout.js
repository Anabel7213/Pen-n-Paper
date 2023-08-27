import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"

import Menu from '@/components/ui/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Menu />
            {children}
      </ThemeProvider>
      </body>
    </html>
  );
}
