// app/layout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "My Blog",
  description: "A personal blog about life, travel, and programming.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <head>
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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}


