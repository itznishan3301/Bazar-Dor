"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import toast from "react-hot-toast";
import { FiLock, FiLogIn, FiArrowLeft, FiClock } from "react-icons/fi";

function PrivateRouteGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(3);

  const fullPath =
    searchParams && searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname || "/";

  const targetLoginUrl = `/signin?callbackUrl=${encodeURIComponent(fullPath)}`;

  useEffect(() => {
    let timer;
    if (!loading && !user) {
      toast.error(
        "লগইন ছাড়া আপনি এই পেজ দেখতে পারবেন না। অনুগ্রহ করে লগইন করুন।",
        { id: "auth-guard-toast" }
      );

      // ৩ সেকেন্ড পর স্বয়ংক্রিয়ভাবে লগইন পেজে নিয়ে যাবে
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(targetLoginUrl);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [user, loading, router, targetLoginUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
          <p className="text-sm font-semibold text-slate-500">
            যাচাই করা হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  // ব্যবহারকারী লগইন অবস্থায় না থাকলে সরাসরি ওয়ার্নিং ও লগইন অ্যাকশন দেখাবে
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />

        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-sm">
              <FiLock />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
                🔒 সংরক্ষিত পেজ (লগইন আবশ্যক)
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
                লগইন ছাড়া আপনি এই পেজটি দেখতে পারবেন না
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                এই পেজের বা পণ্যের বিস্তারিত বাজারদর দেখতে অনুগ্রহ করে প্রথমে সাইন ইন করুন।{" "}
                <span className="block mt-1 font-semibold text-blue-600">
                  লগইন সম্পন্ন হলে আপনি সরাসরি এই পেজেই ফিরে আসবেন।
                </span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
              <FiClock className="text-blue-600 animate-spin" />
              <span>
                <strong className="text-blue-600 font-bold">{countdown}</strong> সেকেন্ডের মধ্যে লগইন পেজে নিয়ে যাওয়া হচ্ছে...
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href={targetLoginUrl}
                className="btn btn-primary w-full sm:w-auto px-6 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <FiLogIn />
                <span>লগইন করুন (এখানেই ফিরে আসবেন)</span>
              </Link>
              <Link
                href="/"
                className="btn btn-outline w-full sm:w-auto px-6 rounded-xl border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center gap-2"
              >
                <FiArrowLeft />
                <span>হোমপেজে যান</span>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return children;
}

export default function PrivateRoute({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
      }
    >
      <PrivateRouteGuard>{children}</PrivateRouteGuard>
    </Suspense>
  );
}
