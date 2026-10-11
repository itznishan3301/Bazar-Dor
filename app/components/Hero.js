import Image from "next/image";
import Link from "next/link";
import { FiArrowDown } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200/80 py-6 sm:py-10 md:py-16">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* বাম পাশে কনটেন্ট */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-medium">
              <span>🌾</span>
              <span>প্রতিদিনের খাঁটি ও নির্ভরযোগ্য বাজারদর</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              নিত্যপ্রয়োজনীয় দ্রব্যের সঠিক দাম জানুন{" "}
              <span className="text-blue-600 block sm:inline">এক নজরে</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              দেশের শীর্ষস্থানীয় পাইকারি ও খুচরা বাজারের চাল, ডাল, তেল, মাছ, মাংস ও সবজির প্রতিদিনের হালনাগাদ মূল্য তালিকা।
              কোনো লুকানো তথ্য ছাড়া সঠিক সিদ্ধান্ত নিন।
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
              <Link
                href="#সব-পণ্য"
                className="btn btn-primary btn-md md:btn-lg rounded-full px-6 sm:px-7 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-white w-full sm:w-auto"
              >
                <span>আজকের বাজারদর দেখুন</span>
                <FiArrowDown className="animate-bounce" />
              </Link>
              <a
                href="#দাম-পরিবর্তন"
                className="btn btn-outline btn-md md:btn-lg rounded-full px-6 border-slate-300 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-700 w-full sm:w-auto flex items-center justify-center"
              >
                দর ওঠানামা
              </a>
            </div>

            {/* ফিচার হাইলাইটস */}
            <div className="pt-3 sm:pt-4 grid grid-cols-3 gap-1.5 sm:gap-4 border-t border-slate-200/70 text-slate-600 text-[11px] sm:text-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>৩৩+ পণ্য তালিকা</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1">
                <span className="text-blue-600 font-bold">✓</span>
                <span>৮টি বিভাগীয় বাজার</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1">
                <span className="text-amber-600 font-bold">✓</span>
                <span>লাইভ প্রাইস ট্র্যাক</span>
              </div>
            </div>
          </div>

          {/* ডান পাশে ব্যানার ইমেজ */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white p-3 rounded-2xl shadow-xl border border-slate-100 group">
              <div className="overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center min-h-[260px]">
                <Image
                  src="/bazar-hero.png"
                  alt="বাজার দর হিরো ব্যানার"
                  width={500}
                  height={350}
                  priority
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-3 -right-2 bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
                <span>আজকের বাজার সক্রিয়</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
