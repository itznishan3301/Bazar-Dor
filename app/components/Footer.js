"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1e293b] text-white mt-12">
      <div className="container-main py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* বামে */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold">বাজার দর</h3>
            <p className="text-sm text-gray-300 mt-1">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>

          {/* ডানে */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400 italic max-w-md">
              &quot;সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত
              হয়।&quot;
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-6 pt-4 text-center">
          <p className="text-xs text-gray-400">
            © ২০২৬ বাজার দর। সকল অধিকার সংরক্ষিত।
          </p>
        </div>
      </div>
    </footer>
  );
}
