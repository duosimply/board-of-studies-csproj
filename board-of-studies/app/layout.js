import { Space_Grotesk } from 'next/font/google'
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: "Board of studies",
  description: "A web application for school student management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
