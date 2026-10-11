"use client";

import { useEffect, useState } from "react";
import { getAllProducts } from "@/app/lib/api";
import { formatPrice, toBanglaNumber } from "@/app/lib/utils";

export default function PriceTicker() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("টিকার ডেটা লোড হয়নি");
      }
    }
    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  // ডাটা দ্বিগুণ করি যেন ইনফিনিট লুপ মনে হয়
  const tickerItems = [...products, ...products];

  return (
    <div className="bg-[#1e293b] text-white py-1.5 ticker-wrapper">
      <div className="ticker-content">
        {tickerItems.map((product, idx) => {
          const isUp = product.change?.dir === "up";
          const isDown = product.change?.dir === "down";
          const pct = toBanglaNumber(product.change?.pct?.toFixed(1) || "0.0");
          const arrow = isUp ? "▲" : isDown ? "▼" : "—";
          const color = isUp
            ? "text-green-400"
            : isDown
            ? "text-red-400"
            : "text-gray-400";

          return (
            <span
              key={`${product.id}-${idx}`}
              className="inline-flex items-center gap-1.5 mx-4 text-sm"
            >
              <span>{product.image}</span>
              <span className="font-medium">{product.nameBn}</span>
              <span className="text-gray-300">
                {formatPrice(product.today)} টাকা
              </span>
              <span className={`${color} font-semibold`}>
                {arrow} {pct}%
              </span>
              <span className="text-gray-600 mx-2">|</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
