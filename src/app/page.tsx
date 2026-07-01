import ComingSoon from '@/components/ComingSoon'
import { Nav } from '@/components/landing/Nav'
import { HeroSection } from '@/components/landing/HeroSection'
import { VorherNachherSection } from '@/components/landing/VorherNachherSection'
import { WieFunktioniertSection } from '@/components/landing/WieFunktioniertSection'
import { TestimonialSection } from '@/components/landing/TestimonialSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { IntegrationenSection } from '@/components/landing/IntegrationenSection'
import { PreiseSection } from '@/components/landing/PreiseSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import { BlogTeaserSection } from '@/components/landing/BlogTeaserSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  if (process.env.NEXT_PUBLIC_COMING_SOON === 'true') {
    return <ComingSoon />
  }

  return (
    <div className="min-h-dvh">
      <Nav />
      <HeroSection />
      <VorherNachherSection />
      <WieFunktioniertSection />
      <TestimonialSection />
      <FeaturesSection />
      <IntegrationenSection />
      <PreiseSection />
      <FAQSection />
      <CTASection />
      <BlogTeaserSection />
      <Footer />
    </div>
  )
}
