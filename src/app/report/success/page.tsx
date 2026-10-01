'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/ui/PublicHeader';
import { CheckCircle, Search, Home, Share2 } from 'lucide-react';

function SuccessContent() {
  const params = useSearchParams();
  const id = params.get('id') || 'CF-2026-00000';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Report Submitted Successfully!</h1>
        <p className="text-slate-500 mb-8">Thank you for helping improve public infrastructure. Authorities have been notified.</p>

        <div className="card bg-slate-50 border-slate-100 mb-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Report ID</span>
            <span className="font-mono font-bold text-blue-600 text-lg">{id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Status</span>
            <span className="status-badge bg-red-100 text-red-700 border-red-200">Reported</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-sm text-blue-700">
          <strong>Save your Report ID:</strong> {id}<br />
          Use this to track the status of your report.
        </div>

        <div className="flex flex-col gap-3">
          <Link href={`/track?id=${id}`} className="btn-primary flex items-center justify-center gap-2">
            <Search size={18} /> Track This Report
          </Link>
          <Link href="/" className="btn-secondary flex items-center justify-center gap-2">
            <Home size={18} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
