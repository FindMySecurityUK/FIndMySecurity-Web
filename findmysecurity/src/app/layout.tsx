'use client';

import Navbar from "@/sections/home/Navbar";
import "./globals.css";
import Footer from "@/sections/home/Footer";
import ToastProvider from "@/sections/components/ToastProvider/ToastProvider";
import Link from 'next/link';
import { MessageSquareIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        {/* <Navbar /> */}
        <main>{children}</main>
        
        {/* Floating Chatbot Button
        {usePathname() !== '/chatbot-ui' && (
          <Link 
            href="/chatbot-ui"
            className="fixed bottom-16 right-6 w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-50 group"
            aria-label="Open AI Chat Assistant"
          >
            <div className="relative">
              <MessageSquareIcon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="absolute -top-10 bg-white text-slate-800 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transform group-hover:-translate-y-1 transition-all duration-200 shadow-md whitespace-nowrap">
              AI Assistant
            </div>
          </Link>
        )} */}

        <footer className="bg-black text-white text-center py-3">
          {/* <Footer /> */}
        </footer>
      </body>
    </html>
  );
}
