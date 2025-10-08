import "./globals.css";
import LayoutClient from "@/components/LayoutClient";
import ModalComponent from "@/components/ModalComponent";

export const metadata = {
  title: "Modern Sat - Dashboard",
  description: "Private dashboard application",
  robots: {
    index: false,
    follow: false,
  },
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
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <style>{`
          body { 
            -webkit-user-select: none; 
            user-select: none; 
            margin: 0;
            padding: 0;
            overflow-x: hidden;
          }
          
          /* تحسينات أداء إضافية */
          * {
            box-sizing: border-box;
          }
          
          /* منع التحديد في العناصر التفاعلية */
          button, input, select, textarea {
            -webkit-user-select: none;
            user-select: none;
          }
        `}</style>
      </head>
      <body className="h-full bg-[#0a0a0a] text-white font-[Inter] antialiased">
        <LayoutClient>{children}</LayoutClient>
        <ModalComponent />

        {/* Scripts لحماية إضافية */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                // منع النقر بزر الماوس الأيمن
                document.addEventListener('contextmenu', (e) => {
                  e.preventDefault();
                  return false;
                });
                
                // منع النسخ والقص
                document.addEventListener('copy', (e) => {
                  e.preventDefault();
                  return false;
                });
                
                document.addEventListener('cut', (e) => {
                  e.preventDefault();
                  return false;
                });
                
                // منع سحب الصور
                document.addEventListener('dragstart', (e) => {
                  if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    return false;
                  }
                });
                
                
                console.log('🔒 Security features activated');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
