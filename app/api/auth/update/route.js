import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export async function POST(request) {
  try {
    const { email, displayName } = await request.json();

    if (!email || !displayName) {
      return NextResponse.json(
        { error: "ইমেইল এবং নতুন নাম প্রদান করা আবশ্যক" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    const normalizedEmail = email.trim().toLowerCase();
    const result = await usersCollection.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          displayName: displayName.trim(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "তথ্য সফলভাবে আপডেট হয়েছে",
      user: {
        email: normalizedEmail,
        displayName: displayName.trim(),
      },
    });
  } catch (err) {
    console.error("তথ্য আপডেট এপিআই এরর:", err);
    return NextResponse.json(
      { error: "তথ্য আপডেট করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
