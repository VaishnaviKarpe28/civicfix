'use client';
import { useEffect, useState } from 'react';
import GovLayout from '@/components/government/GovLayout';
import { getAllReports, getStats } from '@/lib/database/reports';
import { Report } from '@/types';
import { formatDate, getDamageLabel } from '@/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';
import { FileText, Clock, Loader, CheckCircle, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllReports().then(r => { setReports(r); setLoading(false); });
  }, []);

  const stats = getStats(reports);
  const recent = [...reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const STAT_CARDS = [
    { label: 'Total Reports', value: stats.total, icon: FileText, color: 'bg-blue-600', light: 'bg-blue-50 text-blue-600' },
    { label: 'Pending', value: stats.reported, icon: AlertTriangle, color: 'bg-red-500', light: 'bg-red-50 text-red-600' },
    { label: 'Assigned', value: stats.assigned, icon: Clock, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-600' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'bg-green-500', light: 'bg-green-50 text-green-600' },
  ];

  return (
    <GovLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Government Infrastructure Dashboard</h1>
          <p className="text-slate-500 mt-1">Monitor and manage public infrastructure reports</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {STAT_CARDS.map(card => (
            <div key={card.label} className="card">
              <div className={`w-10 h-10 ${card.light} rounded-xl flex items-center justify-center mb-3`}>
                <card.icon size={20} />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {loading ? <div className="w-8 h-6 bg-gray-100 rounded animate-pulse" /> : card.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Resolution Rate */}
        {!loading && stats.total > 0 && (
          <div className="card mb-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-200 text-sm font-medium mb-1">Resolution Rate</div>
                <div className="text-4xl font-bold">{Math.round((stats.resolved / stats.total) * 100)}%</div>
                <div className="text-blue-200 text-sm mt-1">{stats.resolved} of {stats.total} reports resolved</div>
              </div>
              <TrendingUp size={48} className="text-blue-400" />
            </div>
            <div className="mt-4 bg-blue-800/40 rounded-full h-2">
              <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${(stats.resolved / stats.total) * 100}%` }} />
            </div>
          </div>
        )}

        {/* Recent Reports */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900">Recent Reports</h2>
            <Link href="/government/reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Report ID', 'Location', 'Damage', 'Date', 'Status', ''].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map(r => (
                    <tr key={r.reportId} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 font-mono text-blue-600 font-medium">{r.reportId}</td>
                      <td className="py-3 px-2 text-slate-600 max-w-[150px] truncate">{r.address.split(',')[0]}</td>
                      <td className="py-3 px-2 text-slate-600">{getDamageLabel(r.damageType)}</td>
                      <td className="py-3 px-2 text-slate-500">{formatDate(r.createdAt)}</td>
                      <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                      <td className="py-3 px-2">
                        <Link href={`/government/reports/${r.reportId}`} className="text-blue-600 hover:text-blue-700 font-medium">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </GovLayout>
  );
}
