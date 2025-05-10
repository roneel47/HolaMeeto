import type {Metadata} from 'next';
import { Poppins } from 'next/font/google'; // Changed from Geist to Poppins
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({ // Instantiated Poppins
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'] // Added common weights
});

export const metadata: Metadata = {
  title: 'InstantConnect - Quick Jitsi Meet Links',
  description: 'Generate and share Jitsi Meet links instantly with InstantConnect.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}> {/* Used Poppins variable */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
