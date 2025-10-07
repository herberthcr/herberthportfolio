import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Portfolio - Developer",
  description: "Professional CV and Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
