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
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              EduPortal
            </Link>
            <nav className="flex space-x-6 text-sm font-medium">
              <Link href="/" className="hover:text-indigo-600 transition">
                Home / Courses
              </Link>
              <Link href="/enroll" className="hover:text-indigo-600 transition">
                Enroll Now
              </Link>
              <Link href="/admin" className="hover:text-indigo-600 transition text-indigo-600 font-semibold">
                Admin Panel
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} EduPortal. All rights reserved.
        </footer>
      </body>
    </html>
  );
}