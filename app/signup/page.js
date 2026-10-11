"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { registerUser, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();

  // ইউজার রেজিস্ট্রেশন সাবমিশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !email || !password) {
      setErrorMessage("দয়া করে নাম, ইমেইল এবং পাসওয়ার্ড পূরণ করুন।");
      toast.error("সকল ঘর পূরণ করা বাধ্যতামূলক");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।");
      toast.error("পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের দিন");
      return;
    }

    try {
      setSubmitting(true);
      // একাউন্ট তৈরি ও সাথে সাথে অটো-লগইন (MongoDB + Active Session)
      await registerUser(email, password, name);

      toast.success("রেজিস্ট্রেশন ও লগইন সফল হয়েছে! স্বাগতম।");
      router.push("/");
    } catch (err) {
      console.error("রেজিস্ট্রেশন এরর:", err);
      let msg = "রেজিস্ট্রেশন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      if (err.code === "auth/email-already-in-use" || err.message?.includes("ইতিমধ্যে")) {
        msg = "এই ইমেইল দিয়ে ইতিমধ্যে একটি একাউন্ট রয়েছে। দয়া করে লগইন করুন।";
      } else if (err.code === "auth/invalid-email") {
        msg = "প্রদত্ত ইমেইল এড্রেসটি সঠিক নয়।";
      } else if (err.code === "auth/weak-password") {
        msg = "পাসওয়ার্ডটি খুব দুর্বল। আরও শক্তিশালী পাসওয়ার্ড দিন।";
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // সোশ্যাল গুগল রেজিস্ট্রেশন/লগইন (BetterAuth দিয়ে সরাসরি গুগলে একাউন্ট চুজারে নিয়ে যাবে)
  const handleGoogleAuth = async () => {
    try {
      setSubmitting(true);
      setErrorMessage("");
      // সরাসরি Google OAuth একাউন্ট সিলেকশন স্ক্রিনে রিডাইরেক্ট
      await loginWithGoogle();
    } catch (err) {
      console.error("গুগল রিডাইরেক্ট এরর:", err);
      setErrorMessage(
        "গুগল সার্ভারে রিডাইরেক্ট করা সম্ভব হয়নি। Google Cloud Console-এ Authorized redirect URI (http://localhost:3000/api/auth/callback/google) যুক্ত আছে কিনা যাচাই করুন।"
      );
      toast.error("গুগল সংযোগে সমস্যা হয়েছে");
      setSubmitting(false);
    }
  };

  // সোশ্যাল গিটহাব রেজিস্ট্রেশন/লগইন (BetterAuth দিয়ে সরাসরি গিটহাবে নিয়ে যাবে)
  const handleGithubAuth = async () => {
    try {
      setSubmitting(true);
      setErrorMessage("");
      await loginWithGithub();
      // ব্রাউজার স্বয়ংক্রিয়ভাবে গিটহাবের একাউন্ট অথোরাইজেশন উইন্ডোতে চলে যাবে
    } catch (err) {
      console.error("গিটহাব এরর:", err);
      setErrorMessage(
        "গিটহাব সার্ভারে রিডাইরেক্ট করা সম্ভব হয়নি। GitHub Developer Settings-এ Callback URL (http://localhost:3000/api/auth/callback/github) যুক্ত আছে কিনা যাচাই করুন।"
      );
      toast.error("গিটহাব অথেনটিকেশন ব্যর্থ হয়েছে");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
          {/* হেডার */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              📝
            </div>
            <h1 className="text-2xl font-black text-slate-800">
              নতুন একাউন্ট নিবন্ধন করুন
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              বাজার দরে যুক্ত হয়ে প্রতিদিনের বাজারদর যাচাই করুন সহজে।
            </p>
          </div>

          {/* এরর মেসেজ অ্যালার্ট */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 text-center">
              {errorMessage}
            </div>
          )}

          {/* রেজিস্ট্রেশন ফর্ম */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                আপনার পূর্ণ নাম
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="আপনার নাম লিখুন (e.g. মোঃ রাশেদ)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full pl-10 text-sm rounded-xl border-slate-300 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                ইমেইল এড্রেস
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="আপনার ইমেইল দিন (e.g. user@example.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-10 text-sm rounded-xl border-slate-300 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                গোপন পাসওয়ার্ড
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="অন্তত ৬ অক্ষরের পাসওয়ার্ড দিন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-10 text-sm rounded-xl border-slate-300 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {submitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <FiCheckCircle />
                  <span>রেজিস্ট্রেশন সম্পূর্ণ করুন</span>
                </>
              )}
            </button>
          </form>

          {/* ডিভাইডার */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-slate-400 uppercase font-semibold">
              অথবা সোশ্যাল রেজিস্ট্রেশন
            </span>
          </div>

          {/* সোশ্যাল লগইন বাটন */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={submitting}
              className="btn btn-outline w-full rounded-xl border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <FcGoogle className="text-xl" />
              <span>গুগল দিয়ে সরাসরি একাউন্ট খুলুন</span>
            </button>

            <button
              type="button"
              onClick={handleGithubAuth}
              disabled={submitting}
              className="btn btn-outline w-full rounded-xl border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <FaGithub className="text-lg" />
              <span>গিটহাব দিয়ে একাউন্ট খুলুন</span>
            </button>
          </div>

          {/* লগইন লিংক */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              ইতিমধ্যে একাউন্ট আছে?{" "}
              <Link
                href="/signin"
                className="text-blue-600 font-bold hover:underline"
              >
                এখানে সাইন ইন করুন
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
