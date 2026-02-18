import { SiteHeader } from "@/components/interview/site-header"
import { HeroSummary } from "@/components/interview/hero-summary"
import { AudioPlayer } from "@/components/interview/audio-player"
import { AiSummary } from "@/components/interview/ai-summary"
import { ChapterList } from "@/components/interview/chapter-list"
import { BottomCta } from "@/components/interview/bottom-cta"

export default function InterviewArchivePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSummary />
        <AudioPlayer />
        <AiSummary />
        <ChapterList />
        <BottomCta />
      </main>
      <footer className="border-t border-border py-8 text-center">
        <p className="font-serif text-xs text-muted-foreground">
          실타래 &mdash; 소중한 이야기를 기록합니다
        </p>
      </footer>
    </div>
  )
}
