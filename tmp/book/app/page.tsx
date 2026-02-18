"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { BookMockup } from "@/components/book-mockup"
import { PackageSelection, packages, formatPrice } from "@/components/package-selection"
import { CustomizationSection } from "@/components/customization-section"
import { OrderSummary } from "@/components/order-summary"

const EXTRA_COPY_PRICE = 25000

export default function BookOrderPage() {
  const [selectedPackage, setSelectedPackage] = useState("storybook")
  const [selectedCoverStyle, setSelectedCoverStyle] = useState("minimal")
  const [dedication, setDedication] = useState("")
  const [extraCopies, setExtraCopies] = useState(0)

  const selectedPkg = packages.find((p) => p.id === selectedPackage)!
  const showCustomization = selectedPackage !== "digital"

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                {"아카이브"}
              </a>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </li>
            <li>
              <a href="#" className="hover:text-foreground transition-colors">
                {"어머니의 이야기"}
              </a>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </li>
            <li aria-current="page" className="font-medium text-foreground">
              {"책 만들기"}
            </li>
          </ol>
        </nav>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: Book preview */}
          <div className="flex flex-col items-center lg:sticky lg:top-12 lg:self-start">
            <BookMockup />
          </div>

          {/* Right: Configuration */}
          <div className="flex flex-col gap-8">
            {/* Package selection */}
            <PackageSelection
              selectedPackage={selectedPackage}
              onSelect={setSelectedPackage}
            />

            {/* Customization (only for book packages) */}
            {showCustomization && (
              <CustomizationSection
                selectedCoverStyle={selectedCoverStyle}
                onCoverStyleChange={setSelectedCoverStyle}
                dedication={dedication}
                onDedicationChange={setDedication}
                extraCopies={extraCopies}
                onExtraCopiesChange={setExtraCopies}
              />
            )}

            {/* Order summary */}
            <OrderSummary
              packageName={selectedPkg.name}
              packagePrice={selectedPkg.price}
              extraCopies={extraCopies}
              extraCopyPrice={EXTRA_COPY_PRICE}
              showCustomization={showCustomization}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
