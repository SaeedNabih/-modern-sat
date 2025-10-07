import "./globals.css";
import LayoutClient from "@/components/LayoutClient";

export const metadata = {
  title: "Modern Sat",
  description: "Modern Sat Dashboard",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%233B82F6"/><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="60" font-weight="bold" fill="white">M</text></svg>',
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#0a0a0a] text-white font-[Inter] antialiased">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
