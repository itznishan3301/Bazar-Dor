import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* Placeholder container for product sections */}
        <div className="container-main py-10" id="সব-পণ্য">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-slate-800">সব পণ্য</h2>
            <p className="text-slate-500 mt-1">প্রয়োজনীয় সব পণ্যের তালিকা আসছে...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
