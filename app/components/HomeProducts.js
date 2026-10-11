"use client";

import { useState, useEffect } from "react";
import { getAllProducts, getCategories } from "@/app/lib/api";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import { toBanglaNumber } from "@/app/lib/utils";
import Link from "next/link";
import { FiTrendingUp, FiTrendingDown, FiGrid, FiArrowRight } from "react-icons/fi";

export default function HomeProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prodData, catData] = await Promise.all([
          getAllProducts(),
          getCategories(),
        ]);
        setProducts(prodData || []);
        setCategories(catData || []);
      } catch (error) {
        console.error("ডেটা লোড করতে সমস্যা:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // সেকশন A: আজ দাম বেড়েছে (শীর্ষ ৬টি পণ্য)
  const risers = products
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // সেকশন B: আজ দাম কমেছে (শীর্ষ ৬টি পণ্য)
  const fallers = products
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // সেকশন C: সব পণ্য (ক্যাটাগরি ফিল্টার সহ)
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.category === selectedCategory ||
            p.categorySlug === selectedCategory
        );

  return (
    <div className="space-y-10 sm:space-y-14 md:space-y-16 pb-12 sm:pb-16">
      {/* ========================================================
          সেকশন A — আজ দাম বেড়েছে ▲
         ======================================================== */}
      <section id="দাম-পরিবর্তন" className="container-main pt-6 sm:pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-100 text-emerald-800 mb-1.5">
              <FiTrendingUp className="text-emerald-700" />
              <span>মূল্য বৃদ্ধি</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>আজ দাম বেড়েছে</span>
              <span className="text-emerald-600">▲</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              গতকালের তুলনায় যেসব পণ্যের বাজারমূল্য ঊর্ধ্বমুখী (শীর্ষ {toBanglaNumber(risers.length || 6)}টি পণ্য)
            </p>
          </div>
        </div>

        {loading ? (
          <ProductSkeleton count={6} />
        ) : risers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
            {risers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center text-slate-500 text-sm">
            আজ কোনো পণ্যের দাম বৃদ্ধির রেকর্ড নেই।
          </div>
        )}
      </section>

      {/* ========================================================
          সেকশন B — আজ দাম কমেছে ▼
         ======================================================== */}
      <section className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-rose-100 text-rose-800 mb-1.5">
              <FiTrendingDown className="text-rose-700" />
              <span>মূল্য হ্রাস</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>আজ দাম কমেছে</span>
              <span className="text-rose-600">▼</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              গতকালের তুলনায় যেসব পণ্যের দাম কমেছে ও সাশ্রয়ী (শীর্ষ {toBanglaNumber(fallers.length || 6)}টি পণ্য)
            </p>
          </div>
        </div>

        {loading ? (
          <ProductSkeleton count={6} />
        ) : fallers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
            {fallers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center text-slate-500 text-sm">
            আজ কোনো পণ্যের দাম হ্রাসের রেকর্ড নেই।
          </div>
        )}
      </section>

      {/* ========================================================
          সেকশন C — সব পণ্য
         ======================================================== */}
      <section id="সব-পণ্য" className="container-main scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-slate-200/80 pb-3 sm:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-blue-100 text-blue-800 mb-1.5">
              <FiGrid className="text-blue-700" />
              <span>সম্পূর্ণ ক্যাটালগ</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              সব পণ্য
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
              দৈনন্দিন বাজারের সকল নিত্যপ্রয়োজনীয় পণ্যের পূর্ণাঙ্গ তালিকা ({toBanglaNumber(filteredProducts.length)}টি পণ্য পাওয়া গেছে)
            </p>
          </div>

          {/* দ্রুত ক্যাটাগরি ফিল্টার চিপস (মোবাইলে টাচ স্ক্রল) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              সব পণ্য
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug || cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                  selectedCategory === (cat.slug || cat.id)
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <ProductSkeleton count={12} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-base text-slate-600">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি।
            </p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="mt-3 btn btn-sm btn-primary rounded-full px-5"
            >
              সকল পণ্য দেখুন
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
