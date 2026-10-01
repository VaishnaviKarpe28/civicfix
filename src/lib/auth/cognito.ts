const GOVT_CREDENTIALS = { email: 'admin@civicfix.gov.in', password: 'CivicFix@2026' };
const AUTH_KEY = 'civicfix_auth';

export interface GovUser {
  email: string;
  name: string;
  role: string;
}

export async function loginGovernment(email: string, password: string): Promise<GovUser> {
  await new Promise(r => setTimeout(r, 600));
  if (email === GOVT_CREDENTIALS.email && password === GOVT_CREDENTIALS.password) {
    const user: GovUser = { email, name: 'Government Officer', role: 'ADMIN' };
    if (typeof window !== 'undefined') localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }
  throw new Error('Invalid credentials. Use admin@civicfix.gov.in / CivicFix@2026');
}

export function getAuthUser(): GovUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export function logout() {
  if (typeof window !== 'undefined') localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}
