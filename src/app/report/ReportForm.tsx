'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Camera, Upload, X, CheckCircle, User, Phone, AlertTriangle, RotateCcw } from 'lucide-react';
import { DAMAGE_TYPE_OPTIONS, DamageType } from '@/types';
import { createReport } from '@/lib/database/reports';
import { uploadPhoto, validateImageFile } from '@/lib/storage/upload';
import { validateIndianPhone } from '@/utils';
import { toast } from '@/components/ui/Toast';

export default function ReportForm({ address }: { address: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [damageType, setDamageType] = useState<DamageType | null>(null);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhoto = (file: File) => {
    const err = validateImageFile(file);
    if (err) { toast('error', err); return; }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrors(e => ({ ...e, photo: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!photo) e.photo = 'Please capture or upload a photo of the damage.';
    if (!damageType) e.damageType = 'Please select the type of damage.';
    if (!name.trim()) e.name = 'Please enter your name.';
    if (!phone.trim()) e.phone = 'Please enter your phone number.';
    else if (!validateIndianPhone(phone)) e.phone = 'Please enter a valid 10-digit Indian mobile number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const photoUrl = await uploadPhoto(photo!, 'reports');
      const report = await createReport({
        address,
        damageType: damageType!,
        description,
        photoUrl,
        citizenName: name.trim(),
        citizenPhone: phone.replace(/\s+/g, ''),
      });
      router.push(`/report/success?id=${report.reportId}`);
    } catch {
      toast('error', 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Report Infrastructure Damage</h1>
        <p className="text-slate-500 mt-1">Help us fix public infrastructure issues</p>
      </div>

      {/* Location */}
      <div className="card mb-4 bg-blue-50 border-blue-100">
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">📍 Location</div>
            <div className="font-semibold text-slate-800">{address}</div>
            <div className="text-xs text-slate-500 mt-1">Location is automatically provided from the QR code.</div>
          </div>
        </div>
      </div>

      {/* Photo */}
      <div className="card mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Damage Photo <span className="text-red-500">*</span></h3>
        {!photoPreview ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
            <Camera size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-600 mb-1">Take a Photo</p>
            <p className="text-slate-400 text-sm mb-4">Capture a clear photo of the damage</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => cameraRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                <Camera size={16} /> Open Camera
              </button>
              <button onClick={() => fileRef.current?.click()}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                <Upload size={16} /> Upload from Gallery
              </button>
            </div>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
          </div>
        ) : (
          <div className="relative">
            <img src={photoPreview} alt="Damage" className="w-full h-56 object-cover rounded-xl" />
            <div className="flex gap-2 mt-3">
              <button onClick={() => cameraRef.current?.click()}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <RotateCcw size={14} /> Retake
              </button>
              <button onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium ml-auto">
                <X size={14} /> Remove
              </button>
            </div>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
          </div>
        )}
        {errors.photo && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertTriangle size={13} />{errors.photo}</p>}
      </div>

      {/* Damage Type */}
      <div className="card mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Type of Damage <span className="text-red-500">*</span></h3>
        <p className="text-slate-500 text-sm mb-3">What type of damage did you notice?</p>
        <div className="grid grid-cols-2 gap-2">
          {DAMAGE_TYPE_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => { setDamageType(opt.value); setErrors(e => ({ ...e, damageType: '' })); }}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                damageType === opt.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-100 hover:border-gray-200 text-slate-700'
              }`}>
              <span className="text-xl">{opt.icon}</span>
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
        {errors.damageType && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertTriangle size={13} />{errors.damageType}</p>}
      </div>

      {/* Description */}
      <div className="card mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Description <span className="text-slate-400 font-normal text-sm">(Optional)</span></h3>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="e.g. The streetlight has stopped working and the area is dark at night."
          rows={3} className="input-field resize-none" />
      </div>

      {/* Citizen Details */}
      <div className="card mb-4">
        <h3 className="font-semibold text-slate-800 mb-3">Your Details</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Full Name <span className="text-red-500">*</span></label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={name} onChange={e => { setName(e.target.value); setErrors(er => ({ ...er, name: '' })); }}
                placeholder="Enter your name" className="input-field pl-9" />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertTriangle size={13} />{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1 block">Phone Number <span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={phone} onChange={e => { setPhone(e.target.value); setErrors(er => ({ ...er, phone: '' })); }}
                placeholder="+91 XXXXX XXXXX" type="tel" className="input-field pl-9" />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1 flex items-center gap-1"><AlertTriangle size={13} />{errors.phone}</p>}
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3">No account required. Your details are only used for report tracking.</p>
      </div>

      {/* Summary */}
      {(photo || damageType || name) && (
        <div className="card mb-4 bg-slate-50 border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-3 text-sm">Report Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Location:</span><span className="font-medium text-slate-700 text-right max-w-[200px]">{address}</span></div>
            {damageType && <div className="flex justify-between"><span className="text-slate-500">Damage:</span><span className="font-medium text-slate-700">{DAMAGE_TYPE_OPTIONS.find(o => o.value === damageType)?.label}</span></div>}
            <div className="flex justify-between"><span className="text-slate-500">Photo:</span><span className={`font-medium ${photo ? 'text-green-600' : 'text-red-500'}`}>{photo ? '✓ Attached' : '✗ Not attached'}</span></div>
            {name && <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="font-medium text-slate-700">{name}</span></div>}
            {phone && <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-medium text-slate-700">{phone}</span></div>}
          </div>
        </div>
      )}

      <button onClick={handleSubmit} disabled={submitting}
        className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {submitting ? (
          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
        ) : (
          <><CheckCircle size={20} /> Submit Report</>
        )}
      </button>
      <p className="text-center text-xs text-slate-400 mt-3">By submitting, you confirm this report is accurate.</p>
    </div>
  );
}
