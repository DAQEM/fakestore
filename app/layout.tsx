import type { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import './globals.css'; // Assuming you have a globals.css

export const metadata: Metadata = {
  title: 'Fake Store',
  description: 'A fake online store built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 pt-16">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}