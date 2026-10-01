'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Map, BarChart2, QrCode, LogOut, Zap, Menu, X } from 'lucide-react';
import { logout } from '@/lib/auth/cognito';
import { useState } from 'react';

const NAV = [
  { href: '/government/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/government/reports',   icon: FileText,         label: 'Reports' },
  { href: '/government/map',       icon: Map,              label: 'Map View' },
  { href: '/government/analytics', icon: BarChart2,        label: 'Analytics' },
  { href: '/government/qr',        icon: QrCode,           label: 'QR Generator' },
];

function NavLinks({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <>
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              active
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </>
  );
}

function SidebarInner({ pathname, onClose, onLogout }: {
  pathname: string;
  onClose?: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link href="/government/dashboard" onClick={onClose} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-lg leading-none">CivicFix</div>
            <div className="text-slate-400 text-xs">Gov Dashboard</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        <NavLinks pathname={pathname} onClose={onClose} />
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            G
          </div>
          <div>
            <div className="text-white text-sm font-medium">Gov Officer</div>
            <div className="text-slate-400 text-xs">Administrator</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 font-medium w-full"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}

export default function GovSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/government/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 min-h-screen fixed left-0 top-0 z-30">
        <SidebarInner pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Mobile toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-slate-900 h-full">
            <SidebarInner
              pathname={pathname}
              onClose={() => setMobileOpen(false)}
              onLogout={handleLogout}
            />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
