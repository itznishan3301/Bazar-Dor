"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getBanglaDate } from "@/app/lib/utils";
import { getCategories } from "@/app/lib/api";
import toast from "react-hot-toast";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import PriceTicker from "./PriceTicker";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    setBanglaDate(getBanglaDate());
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("ক্যাটাগরি লোড হয়নি:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("সফলভাবে লগআউট হয়েছে");
    } catch (err) {
      toast.error("লগআউট করতে সমস্যা হয়েছে");
    }
  };

  const signinHref =
    pathname && pathname !== "/" && pathname !== "/signin" && pathname !== "/signup"
      ? `/signin?callbackUrl=${encodeURIComponent(pathname)}`
      : "/signin";

  const signupHref =
    pathname && pathname !== "/" && pathname !== "/signin" && pathname !== "/signup"
      ? `/signup?callbackUrl=${encodeURIComponent(pathname)}`
      : "/signup";

  // ক্যাটাগরি লিংক অ্যাক্টিভ কিনা চেক
  const isCategoryActive = (slug) => {
    return pathname === `/category/${slug}`;
  };

  return (
    <>
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* উপরের সারি — লোগো ও অথ বাটন */}
      <div className="container-main">
        <div className="flex items-center justify-between py-3">
          {/* বামে: লোগো */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর লোগো"
              width={36}
              height={36}
              className="rounded"
            />
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text-dark)] leading-tight">
                🛒 বাজার দর
              </h1>
              {banglaDate && (
                <p className="text-xs text-[var(--color-text-light)]">
                  {banglaDate}
                </p>
              )}
            </div>
          </Link>

          {/* ডানে: অথ বাটন (ডেস্কটপ) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <FiUser className="text-lg" />
                  <span>{user.displayName || "প্রোফাইল"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline btn-error"
                >
                  <FiLogOut />
                  লগআউট
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={signinHref}
                  className="text-sm font-medium text-[var(--color-text-body)] hover:text-[var(--color-primary)] transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href={signupHref}
                  className="btn btn-sm btn-primary rounded-full px-5"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>

          {/* মোবাইল মেনু বাটন */}
          <button
            className="md:hidden text-2xl text-[var(--color-text-dark)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="মেনু খুলুন"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* দ্বিতীয় সারি — ক্যাটাগরি ন্যাভ লিংক */}
      <nav className="border-t border-[var(--color-border)] bg-[var(--color-bg-light)]">
        <div className="container-main">
          <div className="hidden md:flex items-center gap-1 py-2 overflow-x-auto">
            <Link
              href="/"
              className={`nav-link text-sm ${
                pathname === "/" ? "active" : ""
              }`}
            >
              হোম
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`nav-link text-sm ${
                  isCategoryActive(cat.slug) ? "active" : ""
                }`}
              >
                {cat.icon} {cat.nameBn}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* মোবাইল মেনু ড্রয়ার */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[var(--color-border)] shadow-lg">
          <div className="container-main py-4 space-y-2">
            <Link
              href="/"
              className={`block nav-link text-sm ${
                pathname === "/" ? "active" : ""
              }`}
              onClick={() => setMobileOpen(false)}
            >
              হোম
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`block nav-link text-sm ${
                  isCategoryActive(cat.slug) ? "active" : ""
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {cat.icon} {cat.nameBn}
              </Link>
            ))}
            <div className="border-t border-[var(--color-border)] pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="block text-sm text-[var(--color-text-body)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FiUser className="inline mr-1" />
                    {user.displayName || "প্রোফাইল"}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="btn btn-sm btn-outline btn-error w-full"
                  >
                    লগআউট
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    href={signinHref}
                    className="btn btn-sm btn-ghost flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    সাইন ইন
                  </Link>
                  <Link
                    href={signupHref}
                    className="btn btn-sm btn-primary rounded-full flex-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    সাইন আপ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    <PriceTicker />
    </>
  );
}
