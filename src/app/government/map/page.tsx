'use client';
import { useEffect, useState } from 'react';
import GovLayout from '@/components/government/GovLayout';
import ToastContainer from '@/components/ui/Toast';
import { getAllReports } from '@/lib/database/reports';
import { Report } from '@/types';
import { getDamageLabel } from '@/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';
import { MapPin, RefreshCw, Filter } from 'lucide-react';

const LOCATION_COORDS: Record<string, { lat: number; lng: number; x: number; y: number }> = {
  'FC Road':       { lat: 18.5204, lng: 73.8567, x: 52, y: 38 },
  'JM Road':       { lat: 18.5162, lng: 73.8520, x: 44, y: 44 },
  'Deccan':        { lat: 18.5167, lng: 73.8478, x: 38, y: 43 },
  'Shivajinagar':  { lat: 18.5308, lng: 73.8474, x: 37, y: 28 },
  'Kothrud':       { lat: 18.5074, lng: 73.8077, x: 18, y: 55 },
  'Baner':         { lat: 18.5590, lng: 73.7868, x: 12, y: 18 },
};

const STATUS_DOT: Record<string, string> = {
  REPORTED:    'bg-red-500 ring-red-200',
  ASSIGNED:    'bg-blue-500 ring-blue-200',
  IN_PROGRESS: 'bg-orange-500 ring-orange-200',
  RESOLVED:    'bg-green-500 ring-green-200',
};

function getCoords(address: string) {
  const key = Object.keys(LOCATION_COORDS).find(k => address.includes(k));
  if (!key) return { x: 50, y: 50 };
  const base = LOCATION_COORDS[key];
  // slight jitter so overlapping pins spread out
  return { x: base.x + (Math.random() - 0.5) * 4, y: base.y + (Math.random() - 0.5) * 4 };
}

export default function MapPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Report | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  // Stable coords stored once so they don't re-randomise on re-render
  const [coords, setCoords] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    getAllReports().then(r => {
      setReports(r);
      const c: Record<string, { x: number; y: number }> = {};
      r.forEach(rep => { c[rep.reportId] = getCoords(rep.address); });
      setCoords(c);
      setLoading(false);
    });
  }, []);

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.status === filter);

  const LEGEND = [
    { status: 'REPORTED',    label: 'Reported',    dot: 'bg-red-500' },
    { status: 'ASSIGNED',    label: 'Assigned',    dot: 'bg-blue-500' },
    { status: 'IN_PROGRESS', label: 'In Progress', dot: 'bg-orange-500' },
    { status: 'RESOLVED',    label: 'Resolved',    dot: 'bg-green-500' },
  ];

  return (
    <GovLayout>
      <ToastContainer />
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Map View</h1>
            <p className="text-slate-500 mt-1">Geographic distribution of infrastructure reports</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="input-field w-44"
            >
              <option value="ALL">All Reports</option>
              <option value="REPORTED">Reported</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Canvas */}
          <div className="lg:col-span-2">
            <div className="card p-0 overflow-hidden">
              {/* Map header bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-slate-50">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <MapPin size={15} className="text-blue-600" />
                  Pune, Maharashtra — Infrastructure Reports
                </div>
                <span className="text-xs text-slate-400">{filtered.length} pins shown</span>
              </div>

              {/* Map area */}
              <div className="relative bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 overflow-hidden"
                style={{ height: 480 }}>

                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Road lines (decorative) */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="10%" y1="40%" x2="90%" y2="42%" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8,4"/>
                  <line x1="35%" y1="10%" x2="38%" y2="90%" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="8,4"/>
                  <line x1="10%" y1="55%" x2="90%" y2="50%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,3"/>
                  <line x1="55%" y1="10%" x2="52%" y2="90%" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,3"/>
                  <line x1="10%" y1="25%" x2="90%" y2="28%" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4,4"/>
                </svg>

                {/* Area labels */}
                {Object.entries(LOCATION_COORDS).map(([name, pos]) => (
                  <div
                    key={name}
                    className="absolute text-xs font-medium text-slate-400 pointer-events-none select-none"
                    style={{ left: `${pos.x}%`, top: `${pos.y + 5}%`, transform: 'translateX(-50%)' }}
                  >
                    {name}
                  </div>
                ))}

                {/* Report pins */}
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  </div>
                ) : (
                  filtered.map(r => {
                    const pos = coords[r.reportId] || { x: 50, y: 50 };
                    const dotClass = STATUS_DOT[r.status] || 'bg-gray-400 ring-gray-200';
                    return (
                      <button
                        key={r.reportId}
                        onClick={() => setSelected(selected?.reportId === r.reportId ? null : r)}
                        className="absolute group"
                        style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        <div className={`w-4 h-4 rounded-full ring-4 ring-opacity-40 ${dotClass} shadow-md
                          transition-transform group-hover:scale-150 ${selected?.reportId === r.reportId ? 'scale-150' : ''}`}
                        />
                        {/* Tooltip */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs
                          rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
                          pointer-events-none z-10 shadow-xl min-w-[160px]">
                          <div className="font-semibold">{r.reportId}</div>
                          <div className="text-slate-300">{r.address.split(',')[0]}</div>
                          <div className="text-slate-400">{getDamageLabel(r.damageType)}</div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                        </div>
                      </button>
                    );
                  })
                )}

                {/* Compass */}
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-xs font-bold text-slate-600 border border-gray-100">
                  N↑
                </div>

                {/* Scale */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-white/80 rounded-lg px-3 py-1.5 text-xs text-slate-500 border border-gray-100">
                  <div className="w-8 h-0.5 bg-slate-400" />
                  2 km
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-t border-gray-100 bg-slate-50">
                {LEGEND.map(l => (
                  <div key={l.status} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <div className={`w-3 h-3 rounded-full ${l.dot}`} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            {/* Selected report detail */}
            {selected ? (
              <div className="card border-blue-100 bg-blue-50/30">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">Selected Report</h3>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="font-mono font-bold text-blue-600">{selected.reportId}</div>
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <MapPin size={13} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    {selected.address}
                  </div>
                  <div className="text-slate-600">{getDamageLabel(selected.damageType)}</div>
                  <div className="pt-1"><StatusBadge status={selected.status} /></div>
                  <div className="text-slate-500 text-xs">Citizen: {selected.citizenName}</div>
                </div>
                <Link
                  href={`/government/reports/${selected.reportId}`}
                  className="mt-4 w-full btn-primary text-sm py-2 flex items-center justify-center gap-1"
                >
                  View Full Report
                </Link>
              </div>
            ) : (
              <div className="card text-center py-8 text-slate-400">
                <MapPin size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">Click a pin to view report details</p>
              </div>
            )}

            {/* Report list */}
            <div className="card p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-slate-50">
                <h3 className="font-semibold text-slate-700 text-sm">Reports ({filtered.length})</h3>
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {loading ? (
                  <div className="p-4 space-y-2">
                    {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-50 rounded animate-pulse" />)}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">No reports for this filter</div>
                ) : (
                  filtered.map(r => (
                    <button
                      key={r.reportId}
                      onClick={() => setSelected(r)}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors ${
                        selected?.reportId === r.reportId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-blue-600 font-medium">{r.reportId}</span>
                        <StatusBadge status={r.status} />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">{r.address.split(',')[0]}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GovLayout>
  );
}
