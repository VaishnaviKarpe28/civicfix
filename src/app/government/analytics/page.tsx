'use client';
import { useEffect, useState } from 'react';
import GovLayout from '@/components/government/GovLayout';
import ToastContainer from '@/components/ui/Toast';
import { getAllReports, getStats } from '@/lib/database/reports';
import { Report, DAMAGE_TYPE_OPTIONS } from '@/types';
import { getDamageLabel, getDepartmentLabel } from '@/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const STATUS_COLORS_CHART: Record<string, string> = {
  Reported:    '#ef4444',
  Assigned:    '#3b82f6',
  'In Progress': '#f97316',
  Resolved:    '#22c55e',
};

const DAMAGE_COLORS = ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f97316','#eab308','#22c55e','#14b8a6'];

const DEPT_COLORS = ['#3b82f6','#6366f1','#f97316','#22c55e','#ec4899','#94a3b8'];

export default function AnalyticsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReports().then(r => { setReports(r); setLoading(false); });
  }, []);

  const stats = getStats(reports);

  // By status
  const statusData = [
    { name: 'Reported',     value: stats.reported,   fill: '#ef4444' },
    { name: 'Assigned',     value: stats.assigned,   fill: '#3b82f6' },
    { name: 'In Progress',  value: stats.inProgress, fill: '#f97316' },
    { name: 'Resolved',     value: stats.resolved,   fill: '#22c55e' },
  ];

  // By damage type
  const damageData = DAMAGE_TYPE_OPTIONS.map((opt, i) => ({
    name: opt.label,
    count: reports.filter(r => r.damageType === opt.value).length,
    fill: DAMAGE_COLORS[i % DAMAGE_COLORS.length],
  })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);

  // By department
  const deptMap: Record<string, number> = {};
  reports.forEach(r => {
    if (r.department) {
      const label = getDepartmentLabel(r.department);
      deptMap[label] = (deptMap[label] || 0) + 1;
    }
  });
  const deptData = Object.entries(deptMap)
    .map(([name, value], i) => ({ name, value, fill: DEPT_COLORS[i % DEPT_COLORS.length] }))
    .sort((a, b) => b.value - a.value);

  // Monthly trend (last 6 months)
  const monthlyData = (() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }
    reports.forEach(r => {
      const d = new Date(r.createdAt);
      const key = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      if (key in months) months[key]++;
    });
    return Object.entries(months).map(([name, count]) => ({ name, count }));
  })();

  if (loading) return (
    <GovLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </GovLayout>
  );

  return (
    <GovLayout>
      <ToastContainer />
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-slate-500 mt-1">Infrastructure report insights and trends</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Reports',  value: stats.total,      color: 'text-blue-600',   bg: 'bg-blue-50' },
            { label: 'Pending',        value: stats.reported,   color: 'text-red-600',    bg: 'bg-red-50' },
            { label: 'In Progress',    value: stats.inProgress, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Resolved',       value: stats.resolved,   color: 'text-green-600',  bg: 'bg-green-50' },
          ].map(k => (
            <div key={k.label} className={`card ${k.bg} border-0`}>
              <div className={`text-3xl font-extrabold ${k.color}`}>{k.value}</div>
              <div className="text-sm text-slate-600 mt-1 font-medium">{k.label}</div>
              {stats.total > 0 && (
                <div className="text-xs text-slate-400 mt-1">
                  {Math.round((k.value / stats.total) * 100)}% of total
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Row 1: Monthly trend + Status pie */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly trend */}
          <div className="card">
            <h2 className="font-bold text-slate-800 mb-5">Monthly Report Trend</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 13 }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="count" name="Reports" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status pie */}
          <div className="card">
            <h2 className="font-bold text-slate-800 mb-5">Reports by Status</h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="60%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 13 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusData.map(s => (
                  <div key={s.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.fill }} />
                      <span className="text-slate-600">{s.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Damage type bar + Department */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Damage type */}
          <div className="card">
            <h2 className="font-bold text-slate-800 mb-5">Reports by Damage Type</h2>
            {damageData.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={damageData} layout="vertical" barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', fontSize: 13 }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="count" name="Reports" radius={[0, 6, 6, 0]}>
                    {damageData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Department */}
          <div className="card">
            <h2 className="font-bold text-slate-800 mb-5">Reports by Department</h2>
            {deptData.length === 0 ? (
              <div className="text-center text-slate-400 py-8 text-sm">No departments assigned yet</div>
            ) : (
              <div className="space-y-3">
                {deptData.map((d, i) => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium">{d.name}</span>
                      <span className="font-bold text-slate-800">{d.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(d.value / Math.max(...deptData.map(x => x.value))) * 100}%`,
                          background: d.fill,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </GovLayout>
  );
}
