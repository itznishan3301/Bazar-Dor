import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="container-main py-10 text-center">
          <h2 className="text-2xl font-bold">🛒 বাজার দর</h2>
          <p className="text-[var(--color-text-body)] mt-2">
            প্রয়োজনীয় পণ্যের দাম এক নজরে
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
