'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const LABELS = {
  title: '실타래 관리자',
  range7d: '최근 7일',
  range30d: '최근 30일',
  rangeAll: '전체',
  totalInterviews: '총 인터뷰',
  totalRecording: '총 녹음 시간',
  conversionRate: '전환율',
  revenue: '매출',
  dailyChart: '일별 인터뷰 수',
  revenueChart: '매출 추이',
  recentLabel: '최근 인터뷰',
  insightsLabel: '데이터 인사이트',
  generationLabel: '세대별 분포',
  topicLabel: '주요 주제 빈도',
};

const RANGES = ['최근 7일', '최근 30일', '전체'] as const;
type Range = typeof RANGES[number];

const DAILY_DATA = [
  { date: '2/12', count: 5 },
  { date: '2/13', count: 9 },
  { date: '2/14', count: 11 },
  { date: '2/15', count: 7 },
  { date: '2/16', count: 10 },
  { date: '2/17', count: 12 },
  { date: '2/18', count: 8 },
];

const REVENUE_DATA = [
  { date: '2/4', revenue: 420 },
  { date: '2/7', revenue: 390 },
  { date: '2/10', revenue: 510 },
  { date: '2/13', revenue: 480 },
  { date: '2/16', revenue: 620 },
  { date: '2/18', revenue: 700 },
];

const GENERATION_DATA = [
  { name: '70대', value: 42, color: '#C4956A' },
  { name: '60대', value: 38, color: '#D4A97A' },
  { name: '80대+', value: 15, color: '#8B6544' },
  { name: '50대', value: 5, color: '#E0C09A' },
];

const TOPIC_DATA = [
  { topic: '어린 시절', percent: 89 },
  { topic: '자녀에게 하고 싶은 말', percent: 76 },
  { topic: '결혼 이야기', percent: 71 },
  { topic: '가장 힘들었던 시기', percent: 65 },
  { topic: '인생의 전환점', percent: 52 },
];

const RECENT_INTERVIEWS = [
  { id: 'int001', date: '2026.02.18', name: '박순자', relation: '어머니', region: '안동', duration: '32분', status: '완료', chapterProgress: '1장 완주', bookOrder: '₩79,000', hasDraft: true, hasChapterContext: true },
  { id: 'int002', date: '2026.02.17', name: '김철수', relation: '아버지', region: '서울', duration: '28분', status: '완료', chapterProgress: '1장 2회차 / turning', bookOrder: null, hasDraft: false, hasChapterContext: true },
  { id: 'int003', date: '2026.02.17', name: '이영희', relation: '할머니', region: '부산', duration: '45분', status: '완료', chapterProgress: '2장 1회차 / space', bookOrder: '₩199,000', hasDraft: true, hasChapterContext: true },
  { id: 'int004', date: '2026.02.16', name: '최미자', relation: '어머니', region: '제주', duration: '31분', status: '진행중', chapterProgress: '1장 1회차 / people', bookOrder: null, hasDraft: false, hasChapterContext: true },
  { id: 'int005', date: '2026.02.16', name: '정태호', relation: '할아버지', region: '대전', duration: '38분', status: '완료', chapterProgress: '1장 3회차 / closing', bookOrder: '₩79,000', hasDraft: true, hasChapterContext: false },
  { id: 'int006', date: '2026.02.15', name: '한미영', relation: '어머니', region: '광주', duration: '27분', status: '실패', chapterProgress: '-', bookOrder: null, hasDraft: false, hasChapterContext: false },
  { id: 'int007', date: '2026.02.15', name: '송병철', relation: '아버지', region: '수원', duration: '41분', status: '완료', chapterProgress: '1장 완주', bookOrder: '₩199,000', hasDraft: true, hasChapterContext: true },
  { id: 'int008', date: '2026.02.14', name: '오혜숙', relation: '할머니', region: '인천', duration: '35분', status: '완료', chapterProgress: '1장 2회차 / people', bookOrder: '₩79,000', hasDraft: false, hasChapterContext: true },
];

const STATUS_BADGE: Record<string, string> = {
  '완료': 'bg-green-50 text-green-700 border border-green-200',
  '진행중': 'bg-amber/10 text-amber border border-amber/30',
  '실패': 'bg-red-50 text-red-600 border border-red-200',
};

function formatChapterProgress(progress: string): { text: string; highlight: boolean } {
  if (progress === '-') return { text: '-', highlight: false };
  if (progress.includes('완주')) return { text: progress, highlight: true };
  return { text: progress, highlight: false };
}

function ChartTooltip({ active, payload, label, unit }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; unit?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-mist bg-warm-white px-3 py-2 shadow-md text-bark">
        <p className="text-xs text-stone">{label}</p>
        <p className="text-sm font-semibold">
          {unit === '₩' ? `₩${payload[0].value.toLocaleString()}만` : `${payload[0].value}건`}
        </p>
      </div>
    );
  }
  return null;
}

function TopicTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { topic: string; percent: number } }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-mist bg-warm-white px-3 py-2 shadow-md">
        <p className="text-xs font-medium text-bark">{payload[0].payload.topic}</p>
        <p className="text-sm font-bold text-amber">{payload[0].payload.percent}%</p>
      </div>
    );
  }
  return null;
}

function MetricCard({ label, value, change, changeLabel, sub }: {
  label: string; value: string; change?: string; changeLabel?: string; sub?: string;
}) {
  return (
    <div className="rounded-xl border border-mist bg-warm-white p-5">
      <p className="text-sm text-stone">{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <p className="font-serif text-[28px] font-bold tracking-tight text-bark">{value}</p>
        {change && (
          <span className="flex items-center text-xs font-medium text-emerald-600 mb-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0"><path d="m7 17 10-10M7 7h10v10"/></svg>
            {change}
          </span>
        )}
      </div>
      {(changeLabel || sub) && (
        <p className="text-xs text-stone mt-0.5">{changeLabel || sub}</p>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [range, setRange] = useState<Range>('최근 7일');
  const [loadingDraft, setLoadingDraft] = useState<string | null>(null);
  const [loadingContext, setLoadingContext] = useState<string | null>(null);

  const handleGenerateDraft = async (interviewId: string) => {
    setLoadingDraft(interviewId);
    try {
      const res = await fetch('/api/chapter-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId, chapterNum: 1 }),
      });
      if (!res.ok) throw new Error('초고 생성 실패');
      alert('초고가 생성되었습니다');
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : '초고 생성 중 오류가 발생했습니다');
    } finally {
      setLoadingDraft(null);
    }
  };

  const handleInitContext = async (interviewId: string) => {
    setLoadingContext(interviewId);
    try {
      const res = await fetch('/api/init-chapter-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interviewId }),
      });
      if (!res.ok) throw new Error('컨텍스트 초기화 실패');
      alert('컨텍스트가 초기화되었습니다');
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : '컨텍스트 초기화 중 오류가 발생했습니다');
    } finally {
      setLoadingContext(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">

          {/* Dashboard header */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-serif text-xl font-bold tracking-tight text-bark sm:text-2xl">{LABELS.title}</h1>
            <div className="flex items-center gap-1 rounded-lg bg-mist-light p-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    range === r
                      ? 'bg-warm-white text-bark shadow-sm'
                      : 'text-stone hover:text-bark'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </header>

          {/* Metric cards */}
          <section aria-label="핵심 지표">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <MetricCard label={LABELS.totalInterviews} value="127건" change="+23%" changeLabel="지난주 대비" />
              <MetricCard label={LABELS.totalRecording} value="63.5시간" sub="평균 30분" />
              <MetricCard label={LABELS.conversionRate} value="34.2%" sub="인터뷰 완료 → 책 주문" />
              <MetricCard label={LABELS.revenue} value="₩4,920,000" change="+18%" changeLabel="지난달 대비" />
            </div>
          </section>

          {/* Charts */}
          <section aria-label="차트" className="flex flex-col gap-4 lg:flex-row">
            {/* Daily interviews bar chart */}
            <div className="min-w-0 flex-1 rounded-xl border border-mist bg-warm-white p-5">
              <h2 className="text-base font-bold text-bark mb-4">{LABELS.dailyChart}</h2>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height={240} minWidth={0}>
                  <BarChart data={DAILY_DATA} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9E9585' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9E9585' }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#E8E0D4', opacity: 0.5 }} />
                    <Bar dataKey="count" fill="#C4956A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue line chart */}
            <div className="min-w-0 flex-1 rounded-xl border border-mist bg-warm-white p-5">
              <h2 className="text-base font-bold text-bark mb-4">{LABELS.revenueChart}</h2>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height={240} minWidth={0}>
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D4" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9E9585' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#9E9585' }} axisLine={false} tickLine={false} width={32} />
                    <Tooltip content={<ChartTooltip unit="₩" />} />
                    <Line type="monotone" dataKey="revenue" stroke="#C4956A" strokeWidth={2.5}
                      dot={{ fill: '#C4956A', r: 3, strokeWidth: 0 }}
                      activeDot={{ fill: '#C4956A', r: 5, strokeWidth: 2, stroke: '#FFFDF9' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Recent interviews table */}
          <section aria-label="최근 인터뷰">
            <div className="rounded-xl border border-mist bg-warm-white overflow-hidden">
              <div className="px-5 py-4 border-b border-mist">
                <h2 className="text-base font-bold text-bark">{LABELS.recentLabel}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-mist bg-mist-light">
                      <th className="text-left px-5 py-3 text-stone font-medium">날짜</th>
                      <th className="text-left px-4 py-3 text-stone font-medium">이름</th>
                      <th className="text-left px-4 py-3 text-stone font-medium">관계</th>
                      <th className="text-left px-4 py-3 text-stone font-medium hidden sm:table-cell">지역</th>
                      <th className="text-left px-4 py-3 text-stone font-medium hidden md:table-cell">소요시간</th>
                      <th className="text-left px-4 py-3 text-stone font-medium">챕터 진도</th>
                      <th className="text-left px-4 py-3 text-stone font-medium">상태</th>
                      <th className="text-right px-4 py-3 text-stone font-medium hidden lg:table-cell">책주문</th>
                      <th className="text-center px-4 py-3 text-stone font-medium">액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mist">
                    {RECENT_INTERVIEWS.map((row, i) => {
                      const chapterProg = formatChapterProgress(row.chapterProgress);
                      return (
                        <tr key={i} className="hover:bg-mist-light transition-colors">
                          <td className="px-5 py-3 text-stone">{row.date}</td>
                          <td className="px-4 py-3 font-medium text-bark">{row.name}</td>
                          <td className="px-4 py-3 text-stone">{row.relation}</td>
                          <td className="px-4 py-3 text-stone hidden sm:table-cell">{row.region}</td>
                          <td className="px-4 py-3 text-stone hidden md:table-cell">{row.duration}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                              chapterProg.highlight
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'text-stone'
                            }`}>
                              {chapterProg.text}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[row.status] || ''}`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-medium hidden lg:table-cell">
                            {row.bookOrder ?? <span className="text-stone">-</span>}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              {/* 초고 생성/확인 버튼 */}
                              <button
                                onClick={() => handleGenerateDraft(row.id)}
                                disabled={loadingDraft === row.id}
                                className="px-3 py-1.5 text-xs font-medium rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                  bg-amber text-warm-white border-amber hover:bg-bark hover:border-bark"
                              >
                                {loadingDraft === row.id
                                  ? '생성 중...'
                                  : row.hasDraft
                                  ? '초고 확인'
                                  : '초고 생성'}
                              </button>

                              {/* 컨텍스트 초기화 버튼 (hasChapterContext가 false일 때만) */}
                              {!row.hasChapterContext && (
                                <button
                                  onClick={() => handleInitContext(row.id)}
                                  disabled={loadingContext === row.id}
                                  className="px-3 py-1.5 text-xs font-medium rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                    bg-stone text-warm-white border-stone hover:bg-bark hover:border-bark"
                                >
                                  {loadingContext === row.id ? '초기화 중...' : '컨텍스트 초기화'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Insights */}
          <section aria-label="데이터 인사이트">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-bark">{LABELS.insightsLabel}</h2>
            </div>
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Generation donut */}
              <div className="min-w-0 flex-1 rounded-xl border border-mist bg-warm-white p-5">
                <h3 className="text-base font-bold text-bark mb-4">{LABELS.generationLabel}</h3>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <div className="h-[200px] w-[200px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie data={GENERATION_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" strokeWidth={0}>
                          {GENERATION_DATA.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [`${v}%`]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-2">
                    {GENERATION_DATA.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-bark">{item.name}</span>
                        <span className="text-sm font-semibold text-bark">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Topic frequency horizontal bar */}
              <div className="min-w-0 flex-1 rounded-xl border border-mist bg-warm-white p-5">
                <h3 className="text-base font-bold text-bark mb-4">{LABELS.topicLabel}</h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height={200} minWidth={0}>
                    <BarChart data={TOPIC_DATA} layout="vertical" margin={{ left: 0, right: 16 }} barSize={16}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis type="category" dataKey="topic" width={130} tick={{ fontSize: 12, fill: '#2C2418' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<TopicTooltip />} cursor={{ fill: '#E8E0D4', opacity: 0.3 }} />
                      <Bar dataKey="percent" fill="#C4956A" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <footer className="py-6 text-center border-t border-mist">
        <a href="/" className="text-[12px] text-stone hover:text-bark transition-colors">🧵 실타래</a>
      </footer>
    </div>
  );
}
