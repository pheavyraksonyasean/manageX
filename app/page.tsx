import { Header } from "@/components/landing-page/header";
import { Hero } from "@/components/landing-page/hero";
import { Features } from "@/components/landing-page/features";
import { CTASection } from "@/components/landing-page/cta-section";
import { Footer } from "@/components/landing-page/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <Header />
      <Hero />
      <Features />
      <CTASection />
      <Footer />
    </div>
  );
}
