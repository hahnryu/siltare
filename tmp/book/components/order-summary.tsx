"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard } from "lucide-react"

interface OrderSummaryProps {
  packageName: string
  packagePrice: number
  extraCopies: number
  extraCopyPrice: number
  showCustomization: boolean
}

function formatPrice(price: number) {
  return `₩${price.toLocaleString("ko-KR")}`
}

export function OrderSummary({
  packageName,
  packagePrice,
  extraCopies,
  extraCopyPrice,
  showCustomization,
}: OrderSummaryProps) {
  const extraTotal = extraCopies * extraCopyPrice
  const total = packagePrice + extraTotal

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <h3 className="text-lg font-bold text-foreground">{"주문 요약"}</h3>

      <div className="flex flex-col gap-2">
        {/* Package line */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{packageName}</span>
          <span className="font-medium tabular-nums text-foreground">{formatPrice(packagePrice)}</span>
        </div>

        {/* Extra copies line */}
        {showCustomization && extraCopies > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {"추가 인쇄"} {extraCopies}{"권"}
            </span>
            <span className="font-medium tabular-nums text-foreground">{formatPrice(extraTotal)}</span>
          </div>
        )}

        <Separator className="my-1 bg-border" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">{"합계"}</span>
          <span className="text-xl font-bold tabular-nums text-primary">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Button
        size="lg"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base"
      >
        {"주문하기"}
      </Button>

      {/* Production time */}
      <p className="text-center text-xs text-muted-foreground">
        {"제작 기간: 영업일 기준 5-7일"}
      </p>

      {/* Payment icons */}
      <div className="flex items-center justify-center gap-3">
        <PaymentBadge label="카카오페이" color="oklch(0.75 0.16 90)" />
        <PaymentBadge label="네이버페이" color="oklch(0.62 0.18 155)" />
        <PaymentBadge label="신용카드" icon />
      </div>
    </div>
  )
}

function PaymentBadge({
  label,
  color,
  icon,
}: {
  label: string
  color?: string
  icon?: boolean
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5">
      {icon ? (
        <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
      ) : (
        <div
          className="h-3 w-3 rounded-sm"
          style={{ background: color }}
          aria-hidden="true"
        />
      )}
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
