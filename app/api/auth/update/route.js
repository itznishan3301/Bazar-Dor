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
    const userCollection = db.collection("user");

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = displayName.trim();

    // 1. Update custom credentials collection ('users')
    await usersCollection.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          displayName: trimmedName,
          name: trimmedName,
          updatedAt: new Date(),
        },
      }
    );

    // 2. Update BetterAuth OAuth collection ('user')
    await userCollection.updateOne(
      { email: normalizedEmail },
      {
        $set: {
          name: trimmedName,
          displayName: trimmedName,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "তথ্য সফলভাবে আপডেট হয়েছে",
      user: {
        email: normalizedEmail,
        displayName: trimmedName,
        name: trimmedName,
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
