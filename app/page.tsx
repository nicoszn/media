import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ToolsGrid from "@/components/landing/ToolsGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh", overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <ToolsGrid />
      <HowItWorks />
      <Features />
      <Footer />
    </main>
  );
}
