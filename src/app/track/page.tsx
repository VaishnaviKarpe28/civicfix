'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PublicHeader from '@/components/ui/PublicHeader';
import ToastContainer from '@/components/ui/Toast';
import { getReportById } from '@/lib/database/reports';
import { Report, ReportStatus } from '@/types';
import { formatDate, getDamageLabel } from '@/utils';
import { Search, MapPin, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

const STATUS_STEPS: { status: ReportStatus; label: string; desc: string }[] = [
  { status: 'REPORTED', label: 'Reported', desc: 'Report received by authorities' },
  { status: 'ASSIGNED', label: 'Assigned', desc: 'Assigned to department' },
  { status: 'IN_PROGRESS', label: 'In Progress', desc: 'Field team working on it' },
  { status: 'RESOLVED', label: 'Resolved', desc: 'Issue has been fixed' },
];

const STATUS_ORDER: ReportStatus[] = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

function TrackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [reportId, setReportId] = useState(params.get('id') || '');
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!reportId.trim()) return;
    setLoading(true);
    setNotFound(false);
    const r = await getReportById(reportId.trim().toUpperCase());
    setLoading(false);
    if (r) { setReport(r); setNotFound(false); }
    else { setReport(null); setNotFound(true); }
  };

  const currentIdx = report ? STATUS_ORDER.indexOf(report.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Track Your Report</h1>
        <p className="text-slate-500">Enter your Report ID to check the current status</p>
      </div>

      <div className="card mb-6">
        <label className="text-sm font-medium text-slate-600 mb-2 block">Report ID</label>
        <div className="flex gap-3">
          <input value={reportId} onChange={e => setReportId(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. CF-2026-00124" className="input-field flex-1 font-mono" />
          <button onClick={handleSearch} disabled={loading}
            className="btn-primary flex items-center gap-2 px-5 whitespace-nowrap">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </div>
      </div>

      {notFound && (
        <div className="card bg-red-50 border-red-100 text-center py-8">
          <AlertCircle size={32} className="text-red-400 mx-auto mb-2" />
          <p className="font-semibold text-red-700">Report Not Found</p>
          <p className="text-red-500 text-sm mt-1">No report found with ID "{reportId}". Please check and try again.</p>
        </div>
      )}

      {report && (
        <div className="space-y-4 animate-fade-in">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Report ID</div>
                <div className="font-mono font-bold text-blue-600 text-lg">{report.reportId}</div>
              </div>
              <StatusBadge status={report.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400 mb-1">Location</div>
                <div className="flex items-start gap-1.5 font-medium text-slate-700">
                  <MapPin size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  {report.address}
                </div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Damage Type</div>
                <div className="font-medium text-slate-700">{getDamageLabel(report.damageType)}</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Submitted</div>
                <div className="font-medium text-slate-700">{formatDate(report.createdAt)}</div>
              </div>
              {report.department && (
                <div>
                  <div className="text-slate-400 mb-1">Department</div>
                  <div className="font-medium text-slate-700">{report.department.replace(/_/g, ' ')}</div>
                </div>
              )}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-5">Status Timeline</h3>
            <div className="space-y-0">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={step.status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        done ? 'bg-green-500' : 'bg-gray-100'
                      }`}>
                        {done ? <CheckCircle size={16} className="text-white" /> : <Circle size={16} className="text-gray-300" />}
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 mt-1 ${done && i < currentIdx ? 'bg-green-400' : 'bg-gray-100'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className={`font-semibold text-sm ${done ? 'text-slate-800' : 'text-slate-400'}`}>
                        {step.label}
                        {active && <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Current</span>}
                      </div>
                      <div className={`text-xs mt-0.5 ${done ? 'text-slate-500' : 'text-slate-300'}`}>{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resolution Photo */}
          {report.status === 'RESOLVED' && report.resolutionPhotoUrl && (
            <div className="card">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" /> Resolution Proof
              </h3>
              <img src={report.resolutionPhotoUrl} alt="Resolution" className="w-full h-48 object-cover rounded-xl" />
              {report.resolvedAt && (
                <p className="text-sm text-slate-500 mt-2">Resolved on {formatDate(report.resolvedAt)}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <ToastContainer />
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
