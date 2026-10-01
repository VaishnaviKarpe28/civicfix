export type ReportStatus = 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export type DamageType =
  | 'POTHOLE'
  | 'DAMAGED_ROAD'
  | 'BROKEN_STREETLIGHT'
  | 'DRAINAGE_ISSUE'
  | 'FOOTPATH_DAMAGE'
  | 'DAMAGED_ROAD_SIGN'
  | 'PUBLIC_FACILITY_DAMAGE'
  | 'OTHER';

export type Department =
  | 'PUBLIC_WORKS'
  | 'ELECTRICAL'
  | 'DRAINAGE'
  | 'ROAD'
  | 'MUNICIPAL_CORPORATION'
  | 'OTHER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Report {
  reportId: string;
  address: string;
  latitude?: number;
  longitude?: number;
  damageType: DamageType;
  description?: string;
  photoUrl: string;
  citizenName: string;
  citizenPhone: string;
  status: ReportStatus;
  department?: Department;
  assignedTo?: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  resolutionPhotoUrl?: string;
  resolvedAt?: string;
}

export interface DamageTypeOption {
  value: DamageType;
  label: string;
  icon: string;
}

export interface DepartmentOption {
  value: Department;
  label: string;
}

export const DAMAGE_TYPE_OPTIONS: DamageTypeOption[] = [
  { value: 'POTHOLE', label: 'Pothole', icon: '🕳️' },
  { value: 'DAMAGED_ROAD', label: 'Damaged Road', icon: '🛣️' },
  { value: 'BROKEN_STREETLIGHT', label: 'Broken Streetlight', icon: '💡' },
  { value: 'DRAINAGE_ISSUE', label: 'Drainage Issue', icon: '🌊' },
  { value: 'FOOTPATH_DAMAGE', label: 'Footpath Damage', icon: '🚶' },
  { value: 'DAMAGED_ROAD_SIGN', label: 'Damaged Road Sign', icon: '🚧' },
  { value: 'PUBLIC_FACILITY_DAMAGE', label: 'Public Facility Damage', icon: '🏛️' },
  { value: 'OTHER', label: 'Other', icon: '⚠️' },
];

export const DEPARTMENT_OPTIONS: DepartmentOption[] = [
  { value: 'PUBLIC_WORKS', label: 'Public Works Department' },
  { value: 'ELECTRICAL', label: 'Electrical Department' },
  { value: 'DRAINAGE', label: 'Drainage Department' },
  { value: 'ROAD', label: 'Road Department' },
  { value: 'MUNICIPAL_CORPORATION', label: 'Municipal Corporation' },
  { value: 'OTHER', label: 'Other' },
];

export const STATUS_LABELS: Record<ReportStatus, string> = {
  REPORTED: 'Reported',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
};

export const STATUS_COLORS: Record<ReportStatus, string> = {
  REPORTED: 'bg-red-100 text-red-700 border-red-200',
  ASSIGNED: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-orange-100 text-orange-700 border-orange-200',
  RESOLVED: 'bg-green-100 text-green-700 border-green-200',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  HIGH: 'bg-orange-100 text-orange-700',
  CRITICAL: 'bg-red-100 text-red-700',
};

export const DEMO_LOCATIONS = [
  'FC Road, Pune, Maharashtra',
  'JM Road, Pune, Maharashtra',
  'Deccan, Pune, Maharashtra',
  'Shivajinagar, Pune, Maharashtra',
  'Kothrud, Pune, Maharashtra',
  'Baner, Pune, Maharashtra',
];
