import { Space_Grotesk, Bodoni_Moda } from 'next/font/google'
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  display: 'swap'
})

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
    <html lang="en" className={`${spaceGrotesk.variable} ${bodoni.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
