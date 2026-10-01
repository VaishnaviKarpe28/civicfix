'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import ReportForm from './ReportForm';
import PublicHeader from '@/components/ui/PublicHeader';
import ToastContainer from '@/components/ui/Toast';
import { QrCode, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function ReportPageContent() {
  const params = useSearchParams();
  const address = params.get('address');

  if (!address) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
          <QrCode size={56} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Scan a QR Code to Report</h2>
          <p className="text-slate-500 mb-6">Please scan the infrastructure QR code at the location to report an issue. The location will be automatically detected.</p>
          <div className="border-t border-gray-100 pt-6">
            <p className="text-sm text-slate-400 mb-3">Don't have a QR code?</p>
            <Link href="/report?address=General+Location%2C+Pune%2C+Maharashtra"
              className="flex items-center justify-center gap-2 w-full btn-primary">
              Report Without QR <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ReportForm address={decodeURIComponent(address)} />;
}

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      <ToastContainer />
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" /></div>}>
        <ReportPageContent />
      </Suspense>
    </div>
  );
}
