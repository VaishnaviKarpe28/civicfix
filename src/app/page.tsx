import Link from 'next/link';
import PublicHeader from '@/components/ui/PublicHeader';
import ToastContainer from '@/components/ui/Toast';
import { ArrowRight, QrCode, Camera, Send, CheckCircle, MapPin, Zap, Shield, TrendingUp } from 'lucide-react';

const ISSUE_TYPES = [
  { icon: '🕳️', label: 'Potholes', color: 'bg-red-50 border-red-100' },
  { icon: '🛣️', label: 'Damaged Roads', color: 'bg-orange-50 border-orange-100' },
  { icon: '💡', label: 'Broken Streetlights', color: 'bg-yellow-50 border-yellow-100' },
  { icon: '🌊', label: 'Drainage Issues', color: 'bg-blue-50 border-blue-100' },
  { icon: '🚶', label: 'Footpath Damage', color: 'bg-purple-50 border-purple-100' },
  { icon: '⚠️', label: 'Other Infrastructure', color: 'bg-gray-50 border-gray-100' },
];

const FLOW_STEPS = [
  { icon: QrCode, label: 'Scan QR', desc: 'Scan the QR code at the location', color: 'bg-blue-600' },
  { icon: Camera, label: 'Take Photo', desc: 'Capture the damage clearly', color: 'bg-indigo-600' },
  { icon: Send, label: 'Report', desc: 'Submit with your details', color: 'bg-violet-600' },
  { icon: Shield, label: 'Gov Action', desc: 'Authorities are notified', color: 'bg-orange-500' },
  { icon: CheckCircle, label: 'Resolved', desc: 'Issue gets fixed', color: 'bg-green-600' },
];

const STATS = [
  { value: '128+', label: 'Reports Filed' },
  { value: '46', label: 'Issues Resolved' },
  { value: '6', label: 'Locations Covered' },
  { value: '<24h', label: 'Avg Response Time' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <ToastContainer />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 text-blue-300 text-sm font-medium mb-6">
              <Zap size={14} />
              Digital Infrastructure Management Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Report. Track.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Resolve.</span>
            </h1>
            <p className="text-xl text-blue-200 font-medium mb-3">
              Digital Reporting and Resolution System for Public Infrastructure Damage
            </p>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl">
              Report potholes, damaged roads, broken streetlights, drainage problems and other public infrastructure issues quickly using your phone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/report" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 text-lg">
                Report an Issue <ArrowRight size={20} />
              </Link>
              <Link href="/track" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg">
                Track Report
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-white">{s.value}</div>
                <div className="text-slate-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-500 text-lg">Report infrastructure damage in under 60 seconds</p>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.label} className="flex lg:flex-col items-center gap-4 lg:gap-3 flex-1">
                <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-0 flex-1 w-full">
                  <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <step.icon size={24} className="text-white" />
                    </div>
                    <div className="text-center mt-3">
                      <div className="font-bold text-slate-800">{step.label}</div>
                      <div className="text-slate-500 text-sm mt-1 max-w-[120px]">{step.desc}</div>
                    </div>
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="hidden lg:block flex-1 h-0.5 bg-gradient-to-r from-slate-300 to-slate-200 mx-4 mt-[-28px]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Issue Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">What Can You Report?</h2>
            <p className="text-slate-500 text-lg">Any public infrastructure damage in your area</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ISSUE_TYPES.map(issue => (
              <Link key={issue.label} href="/report"
                className={`${issue.color} border rounded-2xl p-6 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer`}>
                <div className="text-4xl mb-3">{issue.icon}</div>
                <div className="font-semibold text-slate-700 text-sm">{issue.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* QR System Explainer */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <QrCode size={14} /> Address-Based QR System
              </div>
              <h2 className="text-3xl font-bold mb-4">Scan. Report. Done.</h2>
              <p className="text-blue-100 text-lg mb-6">
                QR codes are physically placed at public infrastructure locations. Scan the code and the location is automatically detected — no manual address entry needed.
              </p>
              <div className="space-y-3">
                {['Location auto-detected from QR code', 'No account or login required', 'Takes less than 60 seconds', 'Instant notification to authorities'].map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <div className="bg-white rounded-xl p-4 inline-block">
                  <QrCode size={80} className="text-slate-800" />
                </div>
                <div className="text-blue-200 text-sm font-mono bg-white/10 rounded-lg px-4 py-2">
                  civicfix.gov.in/report?address=FC+Road,+Pune
                </div>
                <div className="flex items-center gap-2 justify-center text-white">
                  <MapPin size={16} className="text-green-300" />
                  <span className="font-semibold">FC Road, Pune, Maharashtra</span>
                </div>
                <p className="text-blue-200 text-sm">Location automatically displayed after scan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <TrendingUp size={40} className="text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Help Build a Better City</h2>
          <p className="text-slate-400 mb-8">Every report you submit helps municipal authorities prioritize and fix infrastructure issues faster.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/report" className="btn-primary text-lg px-8 py-4">Report an Issue</Link>
            <Link href="/track" className="btn-secondary text-lg px-8 py-4">Track Your Report</Link>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-sm">
        <p>© 2026 CivicFix — Digital Reporting and Resolution System for Public Infrastructure Damage</p>
        <p className="mt-1">Report. Track. Resolve.</p>
      </footer>
    </div>
  );
}
