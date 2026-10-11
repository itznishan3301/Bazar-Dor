"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import PrivateRoute from "@/app/components/PrivateRoute";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { FiUser, FiArrowLeft, FiCheck } from "react-icons/fi";

export default function UpdateProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user?.displayName) {
      setName(user.displayName);
    }
  }, [user]);

  // তথ্য আপডেট ফর্ম সাবমিশন (Challenge C3)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("দয়া করে একটি বৈধ নাম লিখুন");
      return;
    }

    try {
      setSubmitting(true);
      await updateUserProfile(name.trim());
      toast.success("প্রোফাইলের তথ্য সফলভাবে আপডেট হয়েছে!");
      router.push("/profile");
    } catch (err) {
      console.error("প্রোফাইল আপডেট এরর:", err);
      toast.error("তথ্য আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="flex flex-col min-h-screen bg-slate-50 w-full overflow-x-hidden">
        <Navbar />

        <main className="flex-grow container-main py-6 sm:py-10 w-full overflow-x-hidden">
          <div className="max-w-xl mx-auto">
            {/* ব্যাক বাটন */}
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors mb-4 sm:mb-6"
            >
              <FiArrowLeft />
              <span>প্রোফাইলে ফিরে যান</span>
            </Link>

            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-8 md:p-10 space-y-5 sm:space-y-6">
              {/* হেডার */}
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  তথ্য পরিবর্তন করুন (Update Information)
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  আপনার একাউন্টের নাম পরিবর্তন করতে নিচের ঘরে নতুন নাম লিখে আপডেট করুন।
                </p>
              </div>

              {/* আপডেট ফর্ম (C3 requirement: Name input field & Update Information button) */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    আপনার নাম (Name)
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="নতুন নাম লিখুন"
                      className="input input-bordered w-full pl-10 text-sm rounded-xl border-slate-300 focus:border-blue-600"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary rounded-xl px-7 text-white font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow w-full sm:w-auto"
                  >
                    {submitting ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      <>
                        <FiCheck />
                        <span>তথ্য সংরক্ষণ করুন</span>
                      </>
                    )}
                  </button>

                  <Link
                    href="/profile"
                    className="btn btn-ghost rounded-xl text-slate-600"
                  >
                    বাতিল
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PrivateRoute>
  );
}
