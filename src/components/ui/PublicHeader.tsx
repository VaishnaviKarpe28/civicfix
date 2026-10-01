'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Shield, Zap } from 'lucide-react';

export default function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CivicFix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {[['/', 'Home'], ['/#how-it-works', 'How It Works'], ['/report', 'Report an Issue'], ['/track', 'Track Report']].map(([href, label]) => (
              <Link key={href} href={href} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/government/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-navy-800 bg-slate-800 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors">
              <Shield size={15} />
              Government Login
            </Link>
            <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {[['/', 'Home'], ['/#how-it-works', 'How It Works'], ['/report', 'Report an Issue'], ['/track', 'Track Report']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              {label}
            </Link>
          ))}
          <Link href="/government/login" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-3 bg-slate-800 text-white text-sm font-semibold rounded-xl mt-2">
            <Shield size={15} /> Government Login
          </Link>
        </div>
      )}
    </header>
  );
}
