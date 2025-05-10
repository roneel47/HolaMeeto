import type {Metadata} from 'next';
import { Manrope } from 'next/font/google'; // Changed from Poppins to Manrope
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({ // Instantiated Manrope
  variable: '--font-manrope', // Changed variable name
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'] // Kept common weights, adjust if Manrope has different defaults
});

export const metadata: Metadata = {
  title: 'HolaMeeto - Quick Jitsi Meet Links',
  description: 'Generate and share Jitsi Meet links instantly with HolaMeeto.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}> {/* Used Manrope variable */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
