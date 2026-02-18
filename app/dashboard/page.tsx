'use client';

import { Header } from '@/components/Header';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const LABELS = {
  logo: '🧵 실타래',
  title: '관리자 대시보드',
  totalInterviews: '전체 대화',
  completedInterviews: '완료된 대화',
  avgDuration: '평균 시간',
  conversionRate: '완료율',
  weeklyLabel: '주간 생성 추이',
  statusLabel: '상태 분포',
  recentLabel: '최근 대화',
};

const WEEKLY_DATA = [
  { day: '월', count: 3 },
  { day: '화', count: 7 },
  { day: '수', count: 5 },
  { day: '목', count: 9 },
  { day: '금', count: 12 },
  { day: '토', count: 8 },
  { day: '일', count: 4 },
];

const STATUS_DATA = [
  { name: '완료', value: 23, color: '#C4956A' },
  { name: '진행중', value: 8, color: '#8B7355' },
  { name: '대기', value: 5, color: '#E8E0D4' },
];

const RECENT_INTERVIEWS = [
  { id: 'abc123', interviewee: '김영순', requester: '김민수', relationship: '부모님', status: '완료', date: '2026.02.15', duration: '32분' },
  { id: 'def456', interviewee: '이학봉', requester: '이지영', relationship: '부모님', status: '진행중', date: '2026.02.17', duration: '18분' },
  { id: 'ghi789', interviewee: '박정숙', requester: '박성호', relationship: '부모님', status: '대기', date: '2026.02.18', duration: '-' },
  { id: 'jkl012', interviewee: '최강식', requester: '최유진', relationship: '스승', status: '완료', date: '2026.02.16', duration: '41분' },
  { id: 'mno345', interviewee: '정희영', requester: '정민재', relationship: '친구', status: '완료', date: '2026.02.14', duration: '28분' },
];

const STATUS_BADGE: Record<string, string> = {
  '완료': 'text-green-700 bg-green-50',
  '진행중': 'text-amber bg-amber/10',
  '대기': 'text-stone bg-mist',
};

function MetricCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[12px] border border-mist bg-warm-white p-5">
      <p className="text-[13px] text-stone">{label}</p>
      <p className="mt-1 font-serif text-[28px] font-bold text-bark">{value}</p>
      {sub && <p className="text-[12px] text-stone mt-0.5">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        <h1 className="font-serif text-[22px] font-bold text-bark">{LABELS.title}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard label={LABELS.totalInterviews} value="36" sub="누적" />
          <MetricCard label={LABELS.completedInterviews} value="23" sub="전체의 64%" />
          <MetricCard label={LABELS.avgDuration} value="29분" sub="완료 기준" />
          <MetricCard label={LABELS.conversionRate} value="64%" sub="생성 대비 완료" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 rounded-[12px] border border-mist bg-warm-white p-5">
            <h2 className="font-serif text-[16px] font-bold text-bark mb-4">{LABELS.weeklyLabel}</h2>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={WEEKLY_DATA}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C4956A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C4956A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9E9585' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid #E8E0D4', fontSize: 13 }} />
                <Area type="monotone" dataKey="count" stroke="#C4956A" strokeWidth={2} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-[12px] border border-mist bg-warm-white p-5">
            <h2 className="font-serif text-[16px] font-bold text-bark mb-4">{LABELS.statusLabel}</h2>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                  {STATUS_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 6, border: '1px solid #E8E0D4', fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1">
              {STATUS_DATA.map((s) => (
                <div key={s.name} className="flex items-center gap-2 text-[12px] text-stone">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  {s.name} {s.value}건
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[12px] border border-mist bg-warm-white overflow-hidden">
          <div className="px-5 py-4 border-b border-mist">
            <h2 className="font-serif text-[16px] font-bold text-bark">{LABELS.recentLabel}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-mist bg-mist-light">
                  <th className="text-left px-5 py-3 text-stone font-medium">인터뷰이</th>
                  <th className="text-left px-4 py-3 text-stone font-medium">요청자</th>
                  <th className="text-left px-4 py-3 text-stone font-medium">관계</th>
                  <th className="text-left px-4 py-3 text-stone font-medium">상태</th>
                  <th className="text-left px-4 py-3 text-stone font-medium">날짜</th>
                  <th className="text-left px-4 py-3 text-stone font-medium">시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {RECENT_INTERVIEWS.map((row) => (
                  <tr key={row.id} className="hover:bg-mist-light transition-colors">
                    <td className="px-5 py-3 font-medium text-bark">{row.interviewee}</td>
                    <td className="px-4 py-3 text-stone">{row.requester}</td>
                    <td className="px-4 py-3 text-stone">{row.relationship}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_BADGE[row.status] || ''}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone">{row.date}</td>
                    <td className="px-4 py-3 text-stone">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center border-t border-mist">
        <a href="/" className="text-[12px] text-stone hover:text-bark transition-colors">🧵 실타래</a>
      </footer>
    </div>
  );
}
