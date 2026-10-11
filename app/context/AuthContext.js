"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ব্রাউজার লোড হলে বিদ্যমান সেশন পুনরুদ্ধার (লোকাল স্টোরেজ ও BetterAuth Google OAuth)
  useEffect(() => {
    let isMounted = true;
    async function restoreSession() {
      try {
        // ১. লোকাল স্টোরেজ থেকে বিদ্যমান সেশন চেক
        if (typeof window !== "undefined") {
          const savedSession = localStorage.getItem("bazardor_active_session");
          if (savedSession) {
            setUser(JSON.parse(savedSession));
          }
        }

        // ২. BetterAuth সেশন চেক (Google OAuth রিডাইরেক্টের পর)
        if (authClient?.getSession) {
          const sessionRes = await authClient.getSession();
          if (sessionRes?.data?.user && isMounted) {
            const u = sessionRes.data.user;
            const sessionData = {
              uid: u.id,
              displayName: u.name || u.email.split("@")[0],
              email: u.email,
              photoURL: u.image || null,
            };
            setUser(sessionData);
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "bazardor_active_session",
                JSON.stringify(sessionData)
              );
            }
          }
        }
      } catch (e) {
        console.error("সেশন লোড ব্যর্থ:", e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // ইউজার রেজিস্ট্রেশন (MongoDB-তে সেভ হবে এবং সাথে সাথে অটো-লগইন হবে)
  const registerUser = async (email, password, name = "") => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
        if (res.status === 409) {
          error.code = "auth/email-already-in-use";
        }
        throw error;
      }

      // রেজিস্ট্রেশনের সাথে সাথেই সেশন স্টোরেজে সংরক্ষণ ও স্টেট আপডেট (অটো-লগইন)
      const sessionData = data.user;
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "bazardor_active_session",
          JSON.stringify(sessionData)
        );
      }
      setUser(sessionData);

      return sessionData;
    } finally {
      setLoading(false);
    }
  };

  // ইউজার সাইন ইন (MongoDB থেকে ভেরিফাই হবে)
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const error = new Error(data.error || "লগইন ব্যর্থ হয়েছে");
        error.code = "auth/invalid-credential";
        throw error;
      }

      const sessionData = data.user;
      localStorage.setItem(
        "bazardor_active_session",
        JSON.stringify(sessionData)
      );
      setUser(sessionData);
      return sessionData;
    } finally {
      setLoading(false);
    }
  };

  // গুগল দিয়ে সোশ্যাল লগইন (BetterAuth Google OAuth সরাসরি একাউন্ট চুজারে রিডাইরেক্ট)
  const loginWithGoogle = async (callbackUrl = "/") => {
    setLoading(true);
    try {
      if (authClient?.signIn?.social) {
        const res = await authClient.signIn.social({
          provider: "google",
          callbackURL: callbackUrl,
        });
        if (res?.data?.url) {
          window.location.href = res.data.url;
        }
        return res;
      }
      throw new Error("BetterAuth client পাওয়া যায়নি");
    } catch (err) {
      console.error("গুগল অথেনটিকেশন এরর:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // গিটহাব দিয়ে সোশ্যাল লগইন (BetterAuth GitHub OAuth সরাসরি রিডাইরেক্ট)
  const loginWithGithub = async (callbackUrl = "/") => {
    setLoading(true);
    try {
      if (authClient?.signIn?.social) {
        const res = await authClient.signIn.social({
          provider: "github",
          callbackURL: callbackUrl,
        });
        if (res?.data?.url) {
          window.location.href = res.data.url;
        }
        return res;
      }
      throw new Error("BetterAuth client পাওয়া যায়নি");
    } catch (err) {
      console.error("গিটহাব অথেনটিকেশন এরর:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // প্রোফাইল তথ্য আপডেট (MongoDB-তে আপডেট হবে - Challenge C3)
  const updateUserProfile = async (newName) => {
    if (!user) throw new Error("ব্যবহারকারী লগইন অবস্থায় নেই");

    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          displayName: newName,
        }),
      });

      const data = await res.json();

      const updated = {
        ...user,
        displayName: newName,
      };

      localStorage.setItem("bazardor_active_session", JSON.stringify(updated));
      setUser(updated);
      return updated;
    } catch (err) {
      console.error("প্রোফাইল আপডেট এরর:", err);
      const updated = { ...user, displayName: newName };
      localStorage.setItem("bazardor_active_session", JSON.stringify(updated));
      setUser(updated);
      return updated;
    }
  };

  // লগআউট
  const logoutUser = async () => {
    try {
      if (authClient?.signOut) {
        await authClient.signOut();
      }
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("bazardor_active_session");
    setUser(null);
  };

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    loginWithGoogle,
    loginWithGithub,
    updateUserProfile,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
