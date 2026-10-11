"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { loginUser, loginWithGoogle, loginWithGithub } = useAuth();
  const router = useRouter();

  // ইমেইল/পাসওয়ার্ড দিয়ে সাইন ইন
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("দয়া করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন।");
      toast.error("সবগুলো তথ্য সঠিকভাবে পূরণ করুন");
      return;
    }

    try {
      setSubmitting(true);
      await loginUser(email, password);
      toast.success("সফলভাবে সাইন ইন হয়েছে!");
      router.push("/");
    } catch (err) {
      console.error("লগইন এরর:", err);
      const msg = "ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে। আবার চেষ্টা করুন।";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };


  // গুগল দিয়ে সোশ্যাল লগইন
  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      setErrorMessage("");
      await loginWithGoogle();
      toast.success("গুগল দিয়ে সফলভাবে লগইন হয়েছে!");
      router.push("/");
    } catch (err) {
      console.error("গুগল লগইন এরর:", err);
      setErrorMessage("গুগল দিয়ে সাইন ইন করা সম্ভব হয়নি।");
      toast.error("গুগল সাইন ইন ব্যর্থ হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  // গিটহাব দিয়ে সোশ্যাল লগইন
  const handleGithubLogin = async () => {
    try {
      setSubmitting(true);
      setErrorMessage("");
      await loginWithGithub();
      toast.success("গিটহাব দিয়ে সফলভাবে লগইন হয়েছে!");
      router.push("/");
    } catch (err) {
      console.error("গিটহাব লগইন এরর:", err);
      setErrorMessage("গিটহাব দিয়ে সাইন ইন করা সম্ভব হয়নি।");
      toast.error("গিটহাব সাইন ইন ব্যর্থ হয়েছে");
    } finally {
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
              🛒
            </div>
            <h1 className="text-2xl font-black text-slate-800">
              একাউন্টে সাইন ইন করুন
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              বাজার দরে স্বাগতম! নিত্যপণ্যের নির্ভরযোগ্য বাজার তথ্য দেখতে লগইন করুন।
            </p>
          </div>


          {/* এরর মেসেজ অ্যালার্ট */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 text-center">
              {errorMessage}
            </div>
          )}

          {/* লগইন ফর্ম */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="আপনার গোপন পাসওয়ার্ড"
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
                  <span>সাইন ইন করুন</span>
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* ডিভাইডার */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs text-slate-400 uppercase font-semibold">
              অথবা সোশ্যাল লগইন
            </span>
          </div>

          {/* সোশ্যাল লগইন বাটন */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="btn btn-outline w-full rounded-xl border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <FcGoogle className="text-xl" />
              <span>গুগল দিয়ে প্রবেশ করুন</span>
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={submitting}
              className="btn btn-outline w-full rounded-xl border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <FaGithub className="text-lg" />
              <span>গিটহাব দিয়ে প্রবেশ করুন</span>
            </button>
          </div>

          {/* রেজিস্টার লিংক */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              নতুন ব্যবহারকারী?{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-bold hover:underline"
              >
                এখানে বিনামূল্যে একাউন্ট খুলুন
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
