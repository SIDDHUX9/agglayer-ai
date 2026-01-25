import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { PolygonSection } from "@/components/landing/PolygonSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <PolygonSection />
        <FeaturesSection />
        <WhyUsSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}