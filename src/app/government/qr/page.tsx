'use client';
import { useState, useRef, useEffect } from 'react';
import GovLayout from '@/components/government/GovLayout';
import ToastContainer from '@/components/ui/Toast';
import { toast } from '@/components/ui/Toast';
import { DEMO_LOCATIONS } from '@/types';
import { getReportingUrl } from '@/utils';
import { QrCode, Download, MapPin, Copy, ExternalLink, CheckCircle } from 'lucide-react';

interface QREntry {
  address: string;
  url: string;
  dataUrl: string;
}

export default function QRGeneratorPage() {
  const [address, setAddress] = useState('');
  const [generated, setGenerated] = useState<QREntry | null>(null);
  const [generating, setGenerating] = useState(false);
  const [demoQRs, setDemoQRs] = useState<QREntry[]>([]);
  const [loadingDemo, setLoadingDemo] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR using qrcode library
  const generateQR = async (addr: string): Promise<string> => {
    const QRCode = (await import('qrcode')).default;
    return QRCode.toDataURL(getReportingUrl(addr), {
      width: 300,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });
  };

  // Pre-generate demo QRs on mount
  useEffect(() => {
    (async () => {
      const entries: QREntry[] = [];
      for (const loc of DEMO_LOCATIONS) {
        const url = getReportingUrl(loc);
        const dataUrl = await generateQR(loc);
        entries.push({ address: loc, url, dataUrl });
      }
      setDemoQRs(entries);
      setLoadingDemo(false);
    })();
  }, []);

  const handleGenerate = async () => {
    if (!address.trim()) { toast('error', 'Please enter a location address.'); return; }
    setGenerating(true);
    try {
      const url = getReportingUrl(address.trim());
      const dataUrl = await generateQR(address.trim());
      setGenerated({ address: address.trim(), url, dataUrl });
      toast('success', 'QR code generated successfully!');
    } catch {
      toast('error', 'Failed to generate QR code.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (entry: QREntry) => {
    const a = document.createElement('a');
    a.href = entry.dataUrl;
    a.download = `civicfix-qr-${entry.address.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
    a.click();
    toast('success', 'QR code downloaded!');
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast('success', 'URL copied to clipboard!');
  };

  return (
    <GovLayout>
      <ToastContainer />
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">QR Code Generator</h1>
          <p className="text-slate-500 mt-1">Generate address-based QR codes for public infrastructure locations</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          {/* Generator form */}
          <div className="card">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <QrCode size={18} className="text-blue-600" />
              </div>
              <h2 className="font-bold text-slate-800">Generate New QR Code</h2>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">
                Location / Address
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                  placeholder="e.g. FC Road, Pune, Maharashtra"
                  className="input-field pl-9"
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                Enter the exact public location where the QR code will be placed.
              </p>
            </div>

            {/* Quick fill from demo locations */}
            <div className="mb-5">
              <p className="text-xs font-medium text-slate-500 mb-2">Quick fill from demo locations:</p>
              <div className="flex flex-wrap gap-2">
                {DEMO_LOCATIONS.map(loc => (
                  <button
                    key={loc}
                    onClick={() => setAddress(loc)}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg transition-colors font-medium"
                  >
                    {loc.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {generating ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
              ) : (
                <><QrCode size={16} /> Generate QR Code</>
              )}
            </button>

            {/* How it works */}
            <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
              <p className="font-semibold mb-2">How it works:</p>
              <ol className="space-y-1 text-blue-600 text-xs list-decimal list-inside">
                <li>Enter the public location address</li>
                <li>Generate and download the QR code</li>
                <li>Print and physically place it at the location</li>
                <li>Citizens scan it to auto-report issues at that address</li>
              </ol>
            </div>
          </div>

          {/* Generated QR preview */}
          <div className="card flex flex-col items-center justify-center min-h-[320px]">
            {!generated ? (
              <div className="text-center text-slate-300">
                <QrCode size={64} className="mx-auto mb-3" />
                <p className="font-medium text-slate-400">Your QR code will appear here</p>
                <p className="text-sm text-slate-300 mt-1">Enter an address and click Generate</p>
              </div>
            ) : (
              <div className="text-center w-full">
                <div className="inline-block bg-white border-4 border-slate-100 rounded-2xl p-4 shadow-sm mb-4">
                  <img src={generated.dataUrl} alt="QR Code" className="w-48 h-48" />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold mb-1">
                  <MapPin size={15} className="text-blue-500" />
                  {generated.address}
                </div>
                <div className="text-xs text-slate-400 font-mono bg-slate-50 rounded-lg px-3 py-2 mb-4 break-all mx-4">
                  {generated.url}
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={() => handleDownload(generated)}
                    className="btn-primary flex items-center gap-2 text-sm"
                  >
                    <Download size={15} /> Download QR
                  </button>
                  <button
                    onClick={() => handleCopy(generated.url)}
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Copy size={15} /> Copy URL
                  </button>
                  <a
                    href={generated.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center gap-2 text-sm"
                  >
                    <ExternalLink size={15} /> Test Link
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demo QR codes */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle size={18} className="text-green-500" />
            <h2 className="font-bold text-slate-800">Pre-generated Demo QR Codes</h2>
            <span className="text-xs text-slate-400 ml-1">Ready to print and place</span>
          </div>

          {loadingDemo ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {DEMO_LOCATIONS.map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="w-full aspect-square bg-gray-100 rounded-xl mb-3" />
                  <div className="h-3 bg-gray-100 rounded mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {demoQRs.map(entry => (
                <div key={entry.address} className="card p-4 text-center hover:shadow-md transition-shadow">
                  <div className="bg-white border border-gray-100 rounded-xl p-2 mb-3 inline-block">
                    <img src={entry.dataUrl} alt={entry.address} className="w-full max-w-[120px] h-auto" />
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mb-3 leading-tight">
                    {entry.address.split(',')[0]}
                    <span className="block text-slate-400 font-normal">{entry.address.split(',').slice(1).join(',').trim()}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleDownload(entry)}
                      className="w-full flex items-center justify-center gap-1 text-xs bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Download size={12} /> Download
                    </button>
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1 text-xs bg-slate-100 text-slate-600 py-1.5 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                    >
                      <ExternalLink size={12} /> Test
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GovLayout>
  );
}
