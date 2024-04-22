import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProviders from "./utils/reactQueryProvider";
import Navbar from "./utils/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProviders>
          <Navbar />
          <div className="h-screen">{children}</div>
        </ReactQueryProviders>
      </body>
    </html>
  );
}
