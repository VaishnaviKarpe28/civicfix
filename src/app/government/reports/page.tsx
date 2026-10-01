'use client';
import { useEffect, useState } from 'react';
import GovLayout from '@/components/government/GovLayout';
import { getAllReports } from '@/lib/database/reports';
import { Report, ReportStatus, DamageType, DAMAGE_TYPE_OPTIONS, STATUS_LABELS, PRIORITY_COLORS } from '@/types';
import { formatDate, getDamageLabel } from '@/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
  const [damageFilter, setDamageFilter] = useState<DamageType | 'ALL'>('ALL');

  useEffect(() => {
    getAllReports().then(r => { setReports(r); setLoading(false); });
  }, []);

  const filtered = reports.filter(r => {
    const matchSearch = !search || r.reportId.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      r.citizenName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchDamage = damageFilter === 'ALL' || r.damageType === damageFilter;
    return matchSearch && matchStatus && matchDamage;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <GovLayout>
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">All Reports</h1>
          <p className="text-slate-500 mt-1">{reports.length} total reports</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID, location, or citizen name..."
                className="input-field pl-9" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
              className="input-field sm:w-44">
              <option value="ALL">All Statuses</option>
              {(['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'] as ReportStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <select value={damageFilter} onChange={e => setDamageFilter(e.target.value as any)}
              className="input-field sm:w-52">
              <option value="ALL">All Damage Types</option>
              {DAMAGE_TYPE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Filter size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No reports found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-gray-100">
                  <tr>
                    {['Report ID', 'Location', 'Damage Type', 'Citizen', 'Date', 'Priority', 'Status', 'Action'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.reportId} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-blue-600 font-medium whitespace-nowrap">{r.reportId}</td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-[160px]">
                        <div className="truncate">{r.address.split(',')[0]}</div>
                        <div className="text-xs text-slate-400 truncate">{r.address.split(',').slice(1).join(',').trim()}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{getDamageLabel(r.damageType)}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-700">{r.citizenName}</div>
                        <div className="text-xs text-slate-400">{r.citizenPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${PRIORITY_COLORS[r.priority]}`}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4"><StatusBadge status={r.status} /></td>
                      <td className="py-3.5 px-4">
                        <Link href={`/government/reports/${r.reportId}`}
                          className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                          View
                        </Link>
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
