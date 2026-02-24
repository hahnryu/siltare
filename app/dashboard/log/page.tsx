'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  FEEDBACK_ITEMS,
  CHANGELOG,
  FeedbackStatus,
  FeedbackPriority,
} from '@/lib/feedback-data';

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; icon: string; textClass: string; bgClass: string; borderClass: string }
> = {
  done: {
    label: '완료',
    icon: '✓',
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
  },
  wip: {
    label: '진행중',
    icon: '⚙',
    textClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-200',
  },
  todo: {
    label: '예정',
    icon: '○',
    textClass: 'text-stone',
    bgClass: 'bg-mist-light',
    borderClass: 'border-mist',
  },
  hold: {
    label: '보류',
    icon: '–',
    textClass: 'text-stone/50',
    bgClass: 'bg-mist-light',
    borderClass: 'border-mist',
  },
};

const PRIORITY_CONFIG: Record<FeedbackPriority, { label: string; class: string }> = {
  P0:       { label: 'P0',      class: 'bg-red-100 text-red-700' },
  P1:       { label: 'P1',      class: 'bg-orange-100 text-orange-700' },
  P2:       { label: 'P2',      class: 'bg-amber-100 text-amber-700' },
  P3:       { label: 'P3',      class: 'bg-yellow-100 text-yellow-700' },
  roadmap:  { label: '로드맵',  class: 'bg-mist text-stone' },
};

type Filter = 'all' | FeedbackStatus;

const FILTER_BUTTONS: { key: Filter; label: string }[] = [
  { key: 'all',  label: '전체' },
  { key: 'done', label: '✅ 완료' },
  { key: 'wip',  label: '⚙ 진행중' },
  { key: 'todo', label: '○ 예정' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DevLogPage() {
  const [filter, setFilter] = useState<Filter>('all');

  const total = FEEDBACK_ITEMS.length;
  const doneCount  = FEEDBACK_ITEMS.filter((f) => f.status === 'done').length;
  const wipCount   = FEEDBACK_ITEMS.filter((f) => f.status === 'wip').length;
  const todoCount  = FEEDBACK_ITEMS.filter((f) => f.status === 'todo').length;
  const pct = Math.round((doneCount / total) * 100);

  const filtered =
    filter === 'all' ? FEEDBACK_ITEMS : FEEDBACK_ITEMS.filter((f) => f.status === filter);

  // Group by priority for display
  const groups: { key: FeedbackPriority; label: string }[] = [
    { key: 'P0',      label: 'P0 — 이번 주 (시연)' },
    { key: 'P1',      label: 'P1 — Phase 1 어버이날 MVP (5월 8일)' },
    { key: 'P2',      label: 'P2 — Phase 2 관계 분석 (6~7월)' },
    { key: 'P3',      label: 'P3 — Phase 3 구독 + 스케일 (8~9월)' },
    { key: 'roadmap', label: '로드맵 — 미정' },
  ];

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />

      <main className="flex-1 px-5 py-12">
        <div className="mx-auto max-w-4xl">

          {/* ── Head ── */}
          <div className="mb-2 flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-[13px] text-stone transition-colors hover:text-bark"
            >
              ← 대시보드
            </Link>
          </div>

          <h1 className="font-serif text-[34px] font-bold text-bark md:text-[42px]">
            실타래 개발 로그
          </h1>
          <p className="mt-2 text-[15px] text-stone">
            총 {total}개 항목 · {doneCount}개 완료 · {wipCount}개 진행중 · {todoCount}개 예정
          </p>
          <div className="mt-4 rounded-lg border border-amber/30 bg-amber/5 p-4">
            <p className="text-[14px] text-bark">
              📋 <a
                href="https://github.com/hahnryu/siltare/blob/main/FLOW-MAP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline hover:text-amber"
              >
                플로우 맵 (FLOW-MAP.md)
              </a> - 유저 플로우, 상태 전이, 수익 모델, 로그인 정책
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-[13px] text-stone">
              <span>전체 진행률</span>
              <span className="font-medium text-bark">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-mist">
              <div
                className="h-full rounded-full bg-amber transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1.5 flex gap-4 text-[12px] text-stone">
              <span className="text-emerald-700">✓ 완료 {doneCount}</span>
              <span className="text-amber-700">⚙ 진행중 {wipCount}</span>
              <span>○ 예정 {todoCount}</span>
            </div>
          </div>

          {/* ── Filter ── */}
          <div className="mt-8 flex flex-wrap gap-2">
            {FILTER_BUTTONS.map((btn) => (
              <button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                className={`rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  filter === btn.key
                    ? 'bg-bark text-warm-white'
                    : 'border border-mist bg-warm-white text-stone hover:bg-mist-light'
                }`}
              >
                {btn.label}
              </button>
            ))}
            <span className="ml-auto self-center text-[12px] text-stone/60">
              {filtered.length}개 표시
            </span>
          </div>

          {/* ── Items ── */}
          {filter === 'all' ? (
            // Grouped by priority when showing all
            <div className="mt-6 flex flex-col gap-10">
              {groups.map((group) => {
                const items = filtered.filter((f) => f.priority === group.key);
                if (items.length === 0) return null;
                return (
                  <div key={group.key}>
                    <h2 className="mb-3 font-serif text-[16px] font-bold text-bark">
                      {group.label}
                    </h2>
                    <ItemList items={items} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6">
              <ItemList items={filtered} />
            </div>
          )}

          {/* ── Changelog ── */}
          <section className="mt-16 border-t border-mist pt-10">
            <h2 className="mb-6 font-serif text-[22px] font-bold text-bark">변경 이력</h2>
            <div className="flex flex-col gap-6">
              {CHANGELOG.map((entry) => (
                <div key={entry.date} className="grid grid-cols-[100px_1fr] gap-4">
                  <p className="pt-0.5 text-[13px] font-medium text-amber">{entry.date}</p>
                  <ul className="flex flex-col gap-1.5">
                    {entry.items.map((line) => (
                      <li key={line} className="flex items-start gap-2 text-[14px] text-stone">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-mist" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// ── Subcomponent ──────────────────────────────────────────────────────────────

function ItemList({ items }: { items: typeof FEEDBACK_ITEMS }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const s = STATUS_CONFIG[item.status];
        const p = PRIORITY_CONFIG[item.priority];
        const isDone = item.status === 'done';
        return (
          <div
            key={item.id}
            className={`flex items-start gap-3 rounded-[10px] border px-4 py-3 ${s.bgClass} ${s.borderClass}`}
          >
            {/* Status icon */}
            <span
              className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-[11px] font-bold ${s.textClass} border ${s.borderClass} bg-white/60`}
            >
              {s.icon}
            </span>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[12px] font-mono text-stone/60`}>{item.id}</span>
                <span
                  className={`text-[14px] font-medium ${isDone ? 'text-stone line-through decoration-stone/40' : 'text-bark'}`}
                >
                  {item.title}
                </span>
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${p.class}`}>
                  {p.label}
                </span>
              </div>
              <p className={`mt-0.5 text-[13px] ${isDone ? 'text-stone/60' : 'text-stone'}`}>
                {item.description}
              </p>
            </div>

            {/* Page badge + date */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="rounded bg-mist/60 px-2 py-0.5 text-[11px] font-mono text-stone">
                {item.page}
              </span>
              {item.completedAt && (
                <span className="text-[11px] text-emerald-600">{item.completedAt}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
