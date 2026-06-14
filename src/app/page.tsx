import { Nav } from '@/components/landing/Nav'
import { HeroSection } from '@/components/landing/HeroSection'
import { VorherNachherSection } from '@/components/landing/VorherNachherSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { WieFunktioniertSection } from '@/components/landing/WieFunktioniertSection'
import { TestimonialSection } from '@/components/landing/TestimonialSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { IntegrationenSection } from '@/components/landing/IntegrationenSection'
import { PreiseSection } from '@/components/landing/PreiseSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <Nav />
      <HeroSection />
      <VorherNachherSection />
      <ProblemSection />
      <WieFunktioniertSection />
      <TestimonialSection />
      <FeaturesSection />
      <IntegrationenSection />
      <PreiseSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
