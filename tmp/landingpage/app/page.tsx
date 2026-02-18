import { HeroSection } from "@/components/hero-section"
import { DescriptionSection } from "@/components/description-section"
import { CTASection } from "@/components/cta-section"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-[520px] flex-col items-center gap-12">
        <HeroSection />
        <DescriptionSection />
        <CTASection />
      </div>
      <div className="mt-20 md:mt-24">
        <SiteFooter />
      </div>
    </main>
  )
}
