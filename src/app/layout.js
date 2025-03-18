// app/layout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Script from "next/script";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: "James Blogger",
  description: "A personal blog about life, travel, and programming.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.ico" sizes="any" />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-1PS8N6815C`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1PS8N6815C');
          `}
        </Script>
      </head>
      <body>
        
        <Navbar />
        <main>{children}</main>
        <Analytics/>
        <Footer />
      </body>
    </html>
  );
}


