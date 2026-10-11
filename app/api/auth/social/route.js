import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export async function POST(request) {
  try {
    const { provider, email, displayName } = await request.json();

    const normalizedEmail = (
      email || `${provider}.user@bazardor.com`
    ).toLowerCase();
    const name =
      displayName ||
      (provider === "google" ? "গুগল ব্যবহারকারী" : "গিটহাব ডেভেলপার");

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    // ইউজার থাকলে আপডেট, না থাকলে ইনসার্ট (upsert)
    const result = await usersCollection.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          displayName: name,
          provider: provider || "social",
          lastLogin: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    const userDoc = result?.value || result;

    return NextResponse.json({
      success: true,
      message: `${provider} দিয়ে সফলভাবে লগইন হয়েছে`,
      user: {
        uid: userDoc?._id?.toString() || "usr_" + Date.now(),
        displayName: name,
        email: normalizedEmail,
      },
    });
  } catch (err) {
    console.error("সোশ্যাল লগইন এপিআই এরর:", err);
    return NextResponse.json(
      { error: "সোশ্যাল অথেনটিকেশনে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
