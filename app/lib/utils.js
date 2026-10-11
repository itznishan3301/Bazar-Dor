// বাংলা সংখ্যায় রূপান্তর
const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBanglaNumber(num) {
  if (num === null || num === undefined) return "";
  return String(num)
    .split("")
    .map((ch) => {
      if (ch >= "0" && ch <= "9") return banglaDigits[parseInt(ch)];
      return ch;
    })
    .join("");
}

// দাম ফরম্যাট — কমা সেপারেটর সহ বাংলা সংখ্যা
export function formatPrice(price) {
  if (!price && price !== 0) return "—";
  const formatted = price.toLocaleString("en-IN");
  return toBanglaNumber(formatted);
}

// বাংলা তারিখ ফরম্যাটার
const banglaDays = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];
const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export function getBanglaDate() {
  const now = new Date();
  const day = banglaDays[now.getDay()];
  const date = toBanglaNumber(now.getDate());
  const month = banglaMonths[now.getMonth()];
  const year = toBanglaNumber(now.getFullYear());
  return `${day}, ${date} ${month} ${year}`;
}

// ইউনিট বাংলায় রূপান্তর
const unitMap = {
  kg: "প্রতি কেজি",
  liter: "প্রতি লিটার",
  litre: "প্রতি লিটার",
  dozen: "প্রতি ডজন",
  piece: "প্রতি পিস",
  pcs: "প্রতি পিস",
  hali: "প্রতি হালি",
};

export function getUnitBangla(unit) {
  if (!unit) return "";
  return unitMap[unit.toLowerCase()] || unit;
}

// পরিবর্তনের ব্যাজ তথ্য
export function getChangeBadge(change) {
  if (!change) return { text: "— ০.০%", className: "badge-flat" };

  const pct = toBanglaNumber(change.pct?.toFixed(1) || "0.0");

  if (change.dir === "up") {
    return { text: `▲ ${pct}%`, className: "badge-up" };
  } else if (change.dir === "down") {
    return { text: `▼ ${pct}%`, className: "badge-down" };
  }
  return { text: `— ${pct}%`, className: "badge-flat" };
}
