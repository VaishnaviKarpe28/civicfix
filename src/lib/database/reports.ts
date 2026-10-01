import { Report, ReportStatus, DamageType, Priority } from '@/types';

const STORAGE_KEY = 'civicfix_reports';

function generateReportId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CF-${year}-${num}`;
}

const DEMO_REPORTS: Report[] = [
  {
    reportId: 'CF-2026-00124',
    address: 'FC Road, Pune, Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    damageType: 'BROKEN_STREETLIGHT',
    description: 'The streetlight has stopped working and the area is completely dark at night. Very dangerous for pedestrians.',
    photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    citizenName: 'Rahul Patil',
    citizenPhone: '9876543210',
    status: 'IN_PROGRESS',
    department: 'ELECTRICAL',
    assignedTo: 'Suresh Kumar',
    priority: 'HIGH',
    createdAt: '2026-10-01T09:30:00Z',
    updatedAt: '2026-10-03T14:00:00Z',
  },
  {
    reportId: 'CF-2026-00125',
    address: 'JM Road, Pune, Maharashtra',
    latitude: 18.5162,
    longitude: 73.8520,
    damageType: 'POTHOLE',
    description: 'Large pothole near the bus stop. Vehicles are swerving dangerously to avoid it.',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
    citizenName: 'Priya Sharma',
    citizenPhone: '9823456789',
    status: 'REPORTED',
    priority: 'CRITICAL',
    createdAt: '2026-10-02T11:15:00Z',
    updatedAt: '2026-10-02T11:15:00Z',
  },
  {
    reportId: 'CF-2026-00126',
    address: 'Deccan, Pune, Maharashtra',
    latitude: 18.5167,
    longitude: 73.8478,
    damageType: 'DRAINAGE_ISSUE',
    description: 'Blocked drain causing water logging on the road during rains.',
    photoUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600',
    citizenName: 'Amit Desai',
    citizenPhone: '9765432109',
    status: 'ASSIGNED',
    department: 'DRAINAGE',
    assignedTo: 'Drainage Team B',
    priority: 'HIGH',
    createdAt: '2026-10-03T08:00:00Z',
    updatedAt: '2026-10-04T10:30:00Z',
  },
  {
    reportId: 'CF-2026-00127',
    address: 'Shivajinagar, Pune, Maharashtra',
    latitude: 18.5308,
    longitude: 73.8474,
    damageType: 'FOOTPATH_DAMAGE',
    description: 'Broken footpath tiles creating tripping hazard for elderly and children.',
    photoUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600',
    citizenName: 'Sneha Joshi',
    citizenPhone: '9654321098',
    status: 'RESOLVED',
    department: 'PUBLIC_WORKS',
    assignedTo: 'PWD Team A',
    priority: 'MEDIUM',
    createdAt: '2026-09-25T07:45:00Z',
    updatedAt: '2026-10-01T16:00:00Z',
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600',
    resolvedAt: '2026-10-01T16:00:00Z',
  },
  {
    reportId: 'CF-2026-00128',
    address: 'Kothrud, Pune, Maharashtra',
    latitude: 18.5074,
    longitude: 73.8077,
    damageType: 'DAMAGED_ROAD',
    description: 'Road surface has completely deteriorated with multiple cracks and uneven surface.',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
    citizenName: 'Vikram Kulkarni',
    citizenPhone: '9543210987',
    status: 'REPORTED',
    priority: 'HIGH',
    createdAt: '2026-10-04T13:20:00Z',
    updatedAt: '2026-10-04T13:20:00Z',
  },
  {
    reportId: 'CF-2026-00129',
    address: 'Baner, Pune, Maharashtra',
    latitude: 18.5590,
    longitude: 73.7868,
    damageType: 'DAMAGED_ROAD_SIGN',
    description: 'Speed limit sign knocked down, creating confusion for drivers.',
    photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
    citizenName: 'Meera Nair',
    citizenPhone: '9432109876',
    status: 'ASSIGNED',
    department: 'ROAD',
    assignedTo: 'Road Safety Team',
    priority: 'MEDIUM',
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-05T15:30:00Z',
  },
  {
    reportId: 'CF-2026-00130',
    address: 'FC Road, Pune, Maharashtra',
    latitude: 18.5210,
    longitude: 73.8570,
    damageType: 'POTHOLE',
    description: 'Multiple potholes near the college entrance.',
    photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
    citizenName: 'Rohan Mehta',
    citizenPhone: '9321098765',
    status: 'RESOLVED',
    department: 'ROAD',
    assignedTo: 'Road Repair Team C',
    priority: 'HIGH',
    createdAt: '2026-09-20T09:00:00Z',
    updatedAt: '2026-09-28T17:00:00Z',
    resolutionPhotoUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600',
    resolvedAt: '2026-09-28T17:00:00Z',
  },
];

function loadReports(): Report[] {
  if (typeof window === 'undefined') return DEMO_REPORTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return [...DEMO_REPORTS, ...parsed.filter((r: Report) => !DEMO_REPORTS.find(d => d.reportId === r.reportId))];
    }
  } catch {}
  return DEMO_REPORTS;
}

function saveUserReports(reports: Report[]) {
  if (typeof window === 'undefined') return;
  const userReports = reports.filter(r => !DEMO_REPORTS.find(d => d.reportId === r.reportId));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userReports));
}

export async function getAllReports(): Promise<Report[]> {
  await new Promise(r => setTimeout(r, 300));
  return loadReports();
}

export async function getReportById(reportId: string): Promise<Report | null> {
  await new Promise(r => setTimeout(r, 200));
  const reports = loadReports();
  return reports.find(r => r.reportId === reportId) || null;
}

export async function createReport(data: Omit<Report, 'reportId' | 'createdAt' | 'updatedAt' | 'status' | 'priority'>): Promise<Report> {
  await new Promise(r => setTimeout(r, 500));
  const report: Report = {
    ...data,
    reportId: generateReportId(),
    status: 'REPORTED',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const reports = loadReports();
  reports.push(report);
  saveUserReports(reports);
  return report;
}

export async function updateReport(reportId: string, updates: Partial<Report>): Promise<Report> {
  await new Promise(r => setTimeout(r, 400));
  const reports = loadReports();
  const idx = reports.findIndex(r => r.reportId === reportId);
  if (idx === -1) throw new Error('Report not found');
  reports[idx] = { ...reports[idx], ...updates, updatedAt: new Date().toISOString() };
  saveUserReports(reports);
  return reports[idx];
}

export function getStats(reports: Report[]) {
  return {
    total: reports.length,
    reported: reports.filter(r => r.status === 'REPORTED').length,
    assigned: reports.filter(r => r.status === 'ASSIGNED').length,
    inProgress: reports.filter(r => r.status === 'IN_PROGRESS').length,
    resolved: reports.filter(r => r.status === 'RESOLVED').length,
  };
}
