"use client"

import { BookOpen } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Chapter {
  id: string
  number: number
  title: string
  timestamp: string
  excerpt: string
}

const chapters: Chapter[] = [
  {
    id: "ch-1",
    number: 1,
    title: "어린 시절 - 안동의 기억",
    timestamp: "00:00",
    excerpt:
      "\"낙동강이 우리 놀이터였어. 여름이면 형제들이랑 강에 들어가서 물고기를 잡았는데, 손으로 잡았어. 그때는 물이 맑아서 물고기가 다 보였거든...\"",
  },
  {
    id: "ch-2",
    number: 2,
    title: "서울 상경 - 열일곱의 결심",
    timestamp: "08:12",
    excerpt:
      "\"어머니가 보자기 하나를 싸주셨어. 그 안에 옷 두 벌하고 할머니가 쥐어주신 돈 조금. 기차 창밖으로 안동이 멀어지는데, 눈물이 나더라고...\"",
  },
  {
    id: "ch-3",
    number: 3,
    title: "결혼과 가족 - 당신의 아버지를 만나다",
    timestamp: "15:30",
    excerpt:
      "\"네 아버지를 처음 본 건 공장 앞 버스 정류장이었어. 매일 같은 시간에 버스를 기다리는데, 어느 날 우산을 씌워주더라고. 그때 마음이 참 따뜻했어...\"",
  },
  {
    id: "ch-4",
    number: 4,
    title: "가장 힘들었던 시기 - IMF",
    timestamp: "22:45",
    excerpt:
      "\"하루아침에 장사가 안 되는 거야. 단골손님들도 안 오고. 월세를 못 내서 가게를 접었는데, 그날 밤 네 아버지랑 둘이 앉아서 한참을 울었어...\"",
  },
  {
    id: "ch-5",
    number: 5,
    title: "자녀에게 - 민수야, 엄마가 하고 싶은 말",
    timestamp: "28:10",
    excerpt:
      "\"민수야, 엄마가 많이 해준 건 없지만... 네가 건강하고 웃고 살면 그게 엄마한테는 제일 큰 선물이야. 힘들 때 혼자 끙끙대지 말고, 엄마한테 전화해...\"",
  },
]

export function ChapterList() {
  return (
    <section className="px-4 mt-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="size-4 text-accent" />
          <h2 className="font-serif text-xl font-bold text-foreground">
            이야기 목차
          </h2>
        </div>

        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {chapters.map((chapter) => (
              <AccordionItem
                key={chapter.id}
                value={chapter.id}
                className="border-border px-6"
              >
                <AccordionTrigger className="py-5 hover:no-underline">
                  <div className="flex items-start gap-3 text-left">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground mt-0.5">
                      {chapter.number}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground leading-snug">
                        {chapter.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {chapter.timestamp}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-9">
                  <p className="font-serif text-sm text-[#8B7355] leading-relaxed italic">
                    {chapter.excerpt}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
