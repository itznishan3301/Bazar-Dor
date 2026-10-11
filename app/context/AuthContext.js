"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// প্রাথমিক ডেমো ইউজার লিস্ট
const INITIAL_USERS = [
  {
    uid: "usr_demo_101",
    displayName: "সাদিকুর রহমান",
    email: "demo@bazardor.com",
    password: "password123",
  },
  {
    uid: "usr_demo_102",
    displayName: "পরীক্ষক (Examiner)",
    email: "examiner@ph.com",
    password: "123456",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ব্রাউজার লোড হলে বিদ্যমান সেশন ও ইউজার ডেটা পুনরুদ্ধার
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        // রেজিস্টার্ড ইউজার ডেটাবেইজ ইনিশিয়ালাইজেশন
        const existingUsers = localStorage.getItem("bazardor_users");
        if (!existingUsers) {
          localStorage.setItem("bazardor_users", JSON.stringify(INITIAL_USERS));
        }

        // অ্যাক্টিভ সেশন চেক
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

  // ইউজার রেজিস্ট্রেশন (Sign Up)
  const registerUser = async (email, password, name = "") => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300)); // স্বাভাবিক লোডিং ফিল

    const stored = localStorage.getItem("bazardor_users");
    const users = stored ? JSON.parse(stored) : [...INITIAL_USERS];

    // ইমেইল ইতিমধ্যে আছে কিনা চেক
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      setLoading(false);
      const err = new Error("auth/email-already-in-use");
      err.code = "auth/email-already-in-use";
      throw err;
    }

    const newUser = {
      uid: "usr_" + Date.now(),
      displayName: name || email.split("@")[0],
      email: email.trim().toLowerCase(),
      password: password,
    };

    users.push(newUser);
    localStorage.setItem("bazardor_users", JSON.stringify(users));
    setLoading(false);
    return newUser;
  };

  // ইউজার সাইন ইন (Sign In)
  const loginUser = async (email, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const stored = localStorage.getItem("bazardor_users");
    const users = stored ? JSON.parse(stored) : [...INITIAL_USERS];

    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!matched) {
      setLoading(false);
      const err = new Error("auth/invalid-credential");
      err.code = "auth/invalid-credential";
      throw err;
    }

    const sessionData = {
      uid: matched.uid,
      displayName: matched.displayName || matched.email.split("@")[0],
      email: matched.email,
    };

    localStorage.setItem("bazardor_active_session", JSON.stringify(sessionData));
    setUser(sessionData);
    setLoading(false);
    return sessionData;
  };

  // গুগল দিয়ে সোশ্যাল লগইন
  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const googleUser = {
      uid: "usr_google_" + Date.now(),
      displayName: "গুগল ব্যবহারকারী",
      email: "google.user@gmail.com",
    };

    localStorage.setItem("bazardor_active_session", JSON.stringify(googleUser));
    setUser(googleUser);
    setLoading(false);
    return googleUser;
  };

  // গিটহাব দিয়ে সোশ্যাল লগইন
  const loginWithGithub = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const githubUser = {
      uid: "usr_github_" + Date.now(),
      displayName: "গিটহাব ডেভেলপার",
      email: "developer@github.com",
    };

    localStorage.setItem("bazardor_active_session", JSON.stringify(githubUser));
    setUser(githubUser);
    setLoading(false);
    return githubUser;
  };

  // প্রোফাইল তথ্য আপডেট (Challenge C3)
  const updateUserProfile = async (newName) => {
    if (!user) throw new Error("ব্যবহারকারী লগইন অবস্থায় নেই");

    const updated = {
      ...user,
      displayName: newName,
    };

    // কারেন্ট সেশন আপডেট
    localStorage.setItem("bazardor_active_session", JSON.stringify(updated));

    // ডেটাবেজে ইউজারের নাম আপডেট
    try {
      const stored = localStorage.getItem("bazardor_users");
      if (stored) {
        const users = JSON.parse(stored);
        const index = users.findIndex((u) => u.email === user.email);
        if (index !== -1) {
          users[index].displayName = newName;
          localStorage.setItem("bazardor_users", JSON.stringify(users));
        }
      }
    } catch (e) {
      console.error("ডেটাবেজ আপডেট এরর:", e);
    }

    setUser(updated);
    return updated;
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
