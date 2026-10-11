"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PrivateRoute from "@/app/components/PrivateRoute";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiEdit3, FiLogOut, FiShield, FiHome } from "react-icons/fi";

export default function ProfilePage() {
  const { user, logoutUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("সফলভাবে লগআউট হয়েছে");
    } catch (err) {
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex-grow container-main py-6 sm:py-10">
          {/* ব্রেডক্রাম্ব */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 sm:mb-6">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <FiHome />
              <span>হোম</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">আমার প্রোফাইল</span>
          </nav>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
              {/* প্রোফাইল হেডার */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 text-center sm:text-left border-b border-slate-100 pb-5 sm:pb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold shadow-md shrink-0">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "👤"}
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 break-words">
                    {user?.displayName || "নাম নির্ধারণ করা হয়নি"}
                  </h1>
                  <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1">
                    <FiMail className="text-xs" />
                    <span>{user?.email || "ইমেইল নেই"}</span>
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1">
                    <FiShield className="text-xs" />
                    <span>সক্রিয় ব্যবহারকারী</span>
                  </span>
                </div>
              </div>

              {/* বিস্তারিত তথ্য তালিকা */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  ব্যক্তিগত বিবরণ
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-400 block mb-1">
                      পূর্ণ নাম
                    </span>
                    <span className="text-base font-semibold text-slate-800">
                      {user?.displayName || "প্রদান করা হয়নি"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-400 block mb-1">
                      ইমেইল এড্রেস
                    </span>
                    <span className="text-base font-semibold text-slate-800 truncate block">
                      {user?.email || "প্রদান করা হয়নি"}
                    </span>
                  </div>
                </div>
              </div>

              {/* অ্যাকশন বাটনসমূহ (C3 Challenge requirement) */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-between">
                <Link
                  href="/profile/update"
                  className="btn btn-primary rounded-xl px-6 text-white font-bold flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow"
                >
                  <FiEdit3 />
                  <span>তথ্য পরিবর্তন করুন</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-error rounded-xl px-6 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <FiLogOut />
                  <span>লগআউট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PrivateRoute>
  );
}
