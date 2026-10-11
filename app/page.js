import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HomeProducts from "./components/HomeProducts";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HomeProducts />
      </main>
      <Footer />
    </div>
  );
}
