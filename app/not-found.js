import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full overflow-x-hidden">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-8 sm:py-16 px-4 w-full overflow-x-hidden">
        <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto text-4xl shadow-inner">
            <FiAlertTriangle />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              ত্রুটি ৪০৪ / 404 Error
            </span>
            <h1 className="text-3xl font-black text-slate-800">
              পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              আপনি যে পেজ বা পণ্য খুঁজছেন তা সরানো হয়েছে, ঠিকানা পরিবর্তন করা হয়েছে অথবা বর্তমানে উপলব্ধ নেই।
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="btn btn-primary rounded-full px-8 text-white font-bold inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <FiHome />
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-4 text-xs text-slate-400">
            বাজার দর — নিত্যপণ্যের নির্ভরযোগ্য বাজার প্ল্যাটফর্ম
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
