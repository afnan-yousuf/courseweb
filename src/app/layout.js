import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Course Enrollment System",
  description: "Browse courses and enroll online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col text-gray-800`}>
        {/* Glass Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              EduPortal
            </Link>
            <nav className="flex space-x-6 text-sm font-medium">
              <Link href="/" className="text-gray-700 hover:text-indigo-600 transition">
                Home / Courses
              </Link>
              <Link href="/enroll" className="text-gray-700 hover:text-indigo-600 transition">
                Enroll Now
              </Link>
              <Link href="/admin" className="text-indigo-600 hover:text-indigo-700 transition font-semibold">
                Admin Panel
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="backdrop-blur-md bg-white/40 border-t border-white/30 py-6 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} EduPortal. All rights reserved.
        </footer>
      </body>
    </html>
  );
}