import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/layout";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

export const metadata: Metadata = {
  title: "Pike2ThePolls - Ride to the Polls",
  description: "Pike Township residents can sign up for free rides to polling places on election day.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <LayoutWrapper>
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </LayoutWrapper>

        <Footer
          organization="Pike 2 The Polls"
          contact={{
            email: "support@pike2thepolls.com",
            phone: "(317) 978-1131"
          }}
        />
      </body>
    </html>
  );
}
