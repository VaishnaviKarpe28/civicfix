'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GovLayout from '@/components/government/GovLayout';
import { getReportById, updateReport } from '@/lib/database/reports';
import { uploadPhoto, validateImageFile } from '@/lib/storage/upload';
import { Report, ReportStatus, Department, DEPARTMENT_OPTIONS, STATUS_LABELS } from '@/types';
import { formatDateTime, getDamageLabel, getDepartmentLabel } from '@/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import { toast } from '@/components/ui/Toast';
import ToastContainer from '@/components/ui/Toast';
import { MapPin, User, Phone, Calendar, Camera, Upload, CheckCircle, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const STATUS_OPTIONS: ReportStatus[] = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'];

export default function ReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<ReportStatus>('REPORTED');
  const [department, setDepartment] = useState<Department | ''>('');
  const [assignedTo, setAssignedTo] = useState('');
  const [resPhoto, setResPhoto] = useState<File | null>(null);
  const [resPhotoPreview, setResPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    getReportById(reportId).then(r => {
      if (r) {
        setReport(r);
        setStatus(r.status);
        setDepartment(r.department || '');
        setAssignedTo(r.assignedTo || '');
        setResPhotoPreview(r.resolutionPhotoUrl || null);
      }
      setLoading(false);
    });
  }, [reportId]);

  const handleResPhoto = (file: File) => {
    const err = validateImageFile(file);
    if (err) { toast('error', err); return; }
    setResPhoto(file);
    setResPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (status === 'RESOLVED' && !resPhoto && !report?.resolutionPhotoUrl) {
      toast('error', 'Please upload a resolution photo before marking as resolved.');
      return;
    }
    setSaving(true);
    try {
      let resPhotoUrl = report?.resolutionPhotoUrl;
      if (resPhoto) resPhotoUrl = await uploadPhoto(resPhoto, 'resolutions');
      const updated = await updateReport(reportId, {
        status,
        department: department || undefined,
        assignedTo: assignedTo || undefined,
        resolutionPhotoUrl: resPhotoUrl,
        resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : report?.resolvedAt,
      });
      setReport(updated);
      toast('success', 'Report updated successfully.');
    } catch {
      toast('error', 'Failed to update report.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <GovLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </GovLayout>
  );

  if (!report) return (
    <GovLayout>
      <div className="p-8 text-center">
        <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
        <p className="text-slate-600">Report not found.</p>
        <Link href="/government/reports" className="text-blue-600 mt-3 inline-block">← Back to Reports</Link>
      </div>
    </GovLayout>
  );

  return (
    <GovLayout>
      <ToastContainer />
      <div className="p-6 lg:p-8 max-w-5xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/government/reports" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Report Details</h1>
            <p className="text-slate-500 text-sm font-mono">{report.reportId}</p>
          </div>
          <div className="ml-auto"><StatusBadge status={report.status} /></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Report Info */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4">Report Information</h2>
              <div className="space-y-3 text-sm">
                <InfoRow icon={<MapPin size={15} className="text-blue-500" />} label="Location" value={report.address} />
                <InfoRow icon={<span className="text-base">⚠️</span>} label="Damage Type" value={getDamageLabel(report.damageType)} />
                <InfoRow icon={<User size={15} className="text-slate-400" />} label="Citizen" value={report.citizenName} />
                <InfoRow icon={<Phone size={15} className="text-slate-400" />} label="Phone" value={report.citizenPhone} />
                <InfoRow icon={<Calendar size={15} className="text-slate-400" />} label="Submitted" value={formatDateTime(report.createdAt)} />
                {report.updatedAt !== report.createdAt && (
                  <InfoRow icon={<Calendar size={15} className="text-slate-400" />} label="Last Updated" value={formatDateTime(report.updatedAt)} />
                )}
              </div>
              {report.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</div>
                  <p className="text-slate-600 text-sm">{report.description}</p>
                </div>
              )}
            </div>

            {/* Damage Photo */}
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-3">Damage Photo</h2>
              <img src={report.photoUrl} alt="Damage" className="w-full h-56 object-cover rounded-xl" />
            </div>

            {/* Resolution Photo */}
            {resPhotoPreview && (
              <div className="card">
                <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" /> Resolution Photo
                </h2>
                <img src={resPhotoPreview} alt="Resolution" className="w-full h-48 object-cover rounded-xl" />
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-bold text-slate-800 mb-4">Government Actions</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">Assign Department</label>
                  <select value={department} onChange={e => setDepartment(e.target.value as Department)}
                    className="input-field">
                    <option value="">Select Department</option>
                    {DEPARTMENT_OPTIONS.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">Assign Team / Officer</label>
                  <input value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
                    placeholder="e.g. Road Repair Team A" className="input-field" />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600 mb-1.5 block">Change Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <button key={s} onClick={() => setStatus(s)}
                        className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          status === s
                            ? s === 'REPORTED' ? 'border-red-500 bg-red-50 text-red-700'
                            : s === 'ASSIGNED' ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : s === 'IN_PROGRESS' ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-100 text-slate-600 hover:border-gray-200'
                        }`}>
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {status === 'RESOLVED' && (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <p className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <Camera size={15} /> Upload Resolution Photo (Required)
                    </p>
                    {resPhotoPreview ? (
                      <div>
                        <img src={resPhotoPreview} alt="Resolution" className="w-full h-32 object-cover rounded-lg mb-2" />
                        <button onClick={() => fileRef.current?.click()} className="text-sm text-green-600 hover:text-green-700 font-medium">
                          Change Photo
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => fileRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-green-200 rounded-xl py-4 text-green-600 hover:bg-green-100 transition-colors text-sm font-medium">
                        <Upload size={16} /> Upload Resolution Photo
                      </button>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden"
                      onChange={e => e.target.files?.[0] && handleResPhoto(e.target.files[0])} />
                  </div>
                )}

                <button onClick={handleSave} disabled={saving}
                  className="w-full btn-primary flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={16} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GovLayout>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <span className="text-slate-400 text-xs uppercase tracking-wide font-medium">{label}</span>
        <div className="text-slate-700 font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}
