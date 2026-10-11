import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HomeProducts from "./components/HomeProducts";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 w-full overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full overflow-x-hidden">
        <Hero />
        <HomeProducts />
      </main>
      <Footer />
    </div>
  );
}
