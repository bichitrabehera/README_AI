import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReadmeAI - AI-powered GitHub README Generator",
  description: "Generate README files for your GitHub repositories using AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="an">
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
