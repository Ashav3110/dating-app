import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Ashav Suthar — QA Automation Engineer",
  description: "Professional portfolio of Ashav Suthar, an expert QA Automation Engineer specializing in Playwright, API Testing, and AI-driven automation workflows.",
  keywords: ["portfolio", "QA Automation Engineer", "Playwright", "API Testing", "Ashav Suthar", "Test Automation"],
  authors: [{ name: "Ashav Suthar" }],
  openGraph: {
    title: "Ashav Suthar — QA Automation Engineer",
    description: "Expert QA Automation Engineer specializing in Playwright and AI-driven workflows.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#020408] text-white antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
