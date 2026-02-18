"use client"

import { useState } from "react"

export function IntervieweeLanding() {
  const [agreed, setAgreed] = useState(false)

  const requesterName = "민수"
  const intervieweeName = "어머님"

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-6 py-8">
        {/* Wordmark */}
        <header>
          <span className="font-serif text-[14px] text-foreground">
            {"🧵 실타래"}
          </span>
        </header>

        {/* Main Content - vertically centered */}
        <main className="flex flex-1 flex-col items-center justify-center py-10">
          {/* Warm Card */}
          <div
            className="w-full rounded-[12px] border border-border bg-card p-8 shadow-sm"
            role="region"
            aria-label="인터뷰 안내"
          >
            <h1 className="font-serif text-[24px] font-bold leading-relaxed text-card-foreground">
              {`${requesterName}님이`}
              <br />
              {`${intervieweeName}의 이야기를 듣고 싶어합니다.`}
            </h1>

            {/* Divider */}
            <hr className="my-6 border-divider" />

            {/* Body text */}
            <p className="text-[16px] leading-[1.8] text-secondary-text">
              {"편하게 이야기해 주시면 됩니다."}
              <br />
              {"질문을 드리면 생각나시는 대로 말씀해 주세요."}
              <br />
              {"정답도 없고, 틀린 대답도 없습니다."}
            </p>

            {/* Spacer */}
            <div className="h-4" />

            {/* Additional info */}
            <p className="text-[15px] leading-[1.8] text-stone-gray">
              {"30분 정도면 충분합니다."}
              <br />
              {"중간에 쉬셔도 되고, 다음에 이어서 하셔도 됩니다."}
            </p>
          </div>

          {/* Privacy Consent */}
          <div className="mt-6 w-full">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border-2 border-border bg-card checked:border-primary checked:bg-primary"
                style={{
                  backgroundImage: agreed
                    ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
                    : "none",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                aria-describedby="consent-description"
              />
              <span className="text-[16px] leading-snug text-foreground">
                {"대화 내용이 기록되는 것에 동의합니다."}
              </span>
            </label>
            <p
              id="consent-description"
              className="mt-1.5 pl-8 text-[13px] leading-relaxed text-stone-gray"
            >
              {`기록은 ${requesterName}님과 본인만 열람할 수 있습니다.`}
            </p>
          </div>

          {/* CTA Button */}
          <button
            disabled={!agreed}
            onClick={() => {
              // Navigate to interview
            }}
            className="mt-6 w-full rounded-[6px] bg-primary py-4 text-[18px] font-medium text-primary-foreground transition-opacity disabled:opacity-40"
            style={{ height: "56px" }}
            aria-label="동의하고 인터뷰 시작하기"
          >
            {"동의하고 시작하기"}
          </button>
        </main>

        {/* Footer */}
        <footer className="pb-4 pt-2 text-center">
          <p className="text-[12px] text-stone-gray">
            {"이야기는 안전하게 보관되며, 요청자에게만 전달됩니다."}
          </p>
        </footer>
      </div>
    </div>
  )
}
