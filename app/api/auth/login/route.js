import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "ইমেইল এবং পাসওয়ার্ড প্রদান করা আবশ্যক" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    const normalizedEmail = email.trim().toLowerCase();
    const user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "ভুল ইমেইল বা পাসওয়ার্ড প্রদান করা হয়েছে" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "সফলভাবে লগইন হয়েছে",
      user: {
        uid: user._id.toString(),
        displayName: user.displayName || user.email.split("@")[0],
        email: user.email,
      },
    });
  } catch (err) {
    console.error("লগইন এপিআই এরর:", err);
    return NextResponse.json(
      { error: "সার্ভার এরর। অনুগ্রহ করে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
