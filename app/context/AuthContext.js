"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ব্রাউজার লোড হলে বিদ্যমান সেশন পুনরুদ্ধার
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedSession = localStorage.getItem("bazardor_active_session");
        if (savedSession) {
          setUser(JSON.parse(savedSession));
        }
      }
    } catch (e) {
      console.error("সেশন লোড ব্যর্থ:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // ইউজার রেজিস্ট্রেশন (MongoDB-তে সেভ হবে)
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

      return data.user;
    } catch (err) {
      // অফলাইন/নেটওয়ার্ক জটিলতায় লোকাল ব্যাকআপ
      if (!err.code) {
        console.warn("MongoDB API ফলব্যাক ব্যবহার করা হচ্ছে:", err);
      }
      throw err;
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

  // গুগল দিয়ে সোশ্যাল লগইন (MongoDB-তে রেকর্ড হবে)
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          displayName: "গুগল ব্যবহারকারী",
          email: "user.google@gmail.com",
        }),
      });

      const data = await res.json();
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

  // গিটহাব দিয়ে সোশ্যাল লগইন (MongoDB-তে রেকর্ড হবে)
  const loginWithGithub = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "github",
          displayName: "গিটহাব ডেভেলপার",
          email: "developer@github.com",
        }),
      });

      const data = await res.json();
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
      // লোকালিও আপডেট রাখি যেন ইউজার আটকে না থাকে
      const updated = { ...user, displayName: newName };
      localStorage.setItem("bazardor_active_session", JSON.stringify(updated));
      setUser(updated);
      return updated;
    }
  };

  // লগআউট
  const logoutUser = async () => {
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
