import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero'
import { TrustBar } from '@/components/home/trust-bar'
import { ServicesSection } from '@/components/home/services'
import { HowItWorks } from '@/components/home/how-it-works'
import { FeaturedProfessionals } from '@/components/home/featured-professionals'
import { GamificationPreview } from '@/components/home/gamification-preview'
import { StorePreview } from '@/components/home/store-preview'
import { Testimonials } from '@/components/home/testimonials'
import { ProfessionalCTA } from '@/components/home/professional-cta'
import { FAQ } from '@/components/home/faq'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <ServicesSection />
        <HowItWorks />
        <FeaturedProfessionals />
        <GamificationPreview />
        <StorePreview />
        <Testimonials />
        <ProfessionalCTA />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
