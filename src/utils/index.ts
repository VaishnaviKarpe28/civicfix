export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function validateIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''));
}

export function encodeAddress(address: string): string {
  return encodeURIComponent(address);
}

export function decodeAddress(encoded: string): string {
  try { return decodeURIComponent(encoded); } catch { return encoded; }
}

export function getReportingUrl(address: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base}/report?address=${encodeAddress(address)}`;
}

export function getDamageLabel(type: string): string {
  const map: Record<string, string> = {
    POTHOLE: 'Pothole',
    DAMAGED_ROAD: 'Damaged Road',
    BROKEN_STREETLIGHT: 'Broken Streetlight',
    DRAINAGE_ISSUE: 'Drainage Issue',
    FOOTPATH_DAMAGE: 'Footpath Damage',
    DAMAGED_ROAD_SIGN: 'Damaged Road Sign',
    PUBLIC_FACILITY_DAMAGE: 'Public Facility Damage',
    OTHER: 'Other',
  };
  return map[type] || type;
}

export function getDepartmentLabel(dept: string): string {
  const map: Record<string, string> = {
    PUBLIC_WORKS: 'Public Works Department',
    ELECTRICAL: 'Electrical Department',
    DRAINAGE: 'Drainage Department',
    ROAD: 'Road Department',
    MUNICIPAL_CORPORATION: 'Municipal Corporation',
    OTHER: 'Other',
  };
  return map[dept] || dept;
}
