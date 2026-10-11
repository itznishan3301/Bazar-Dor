import { NextResponse } from "next/server";
import { getDatabase } from "@/app/lib/mongodb";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "ইমেইল এবং পাসওয়ার্ড প্রদান করা বাধ্যতামূলক" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection("users");

    // ইতিমধ্যে একই ইমেইল রেজিস্টার্ড আছে কিনা চেক
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await usersCollection.findOne({ email: normalizedEmail });

    if (existing) {
      return NextResponse.json(
        { error: "এই ইমেইল দিয়ে ইতিমধ্যে একটি একাউন্ট খোলা হয়েছে" },
        { status: 409 }
      );
    }

    const newUser = {
      displayName: name?.trim() || normalizedEmail.split("@")[0],
      email: normalizedEmail,
      password: password, // বাস্তব প্রজেক্টের ক্ষেত্রে হ্যাশ করা হয়
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json(
      {
        success: true,
        message: "রেজিস্ট্রেশন সফল হয়েছে",
        user: {
          uid: result.insertedId.toString(),
          displayName: newUser.displayName,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("রেজিস্ট্রেশন এপিআই এরর:", err);
    return NextResponse.json(
      { error: "সার্ভারে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
