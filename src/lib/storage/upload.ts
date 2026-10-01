export async function uploadPhoto(file: File, folder: string = 'reports'): Promise<string> {
  await new Promise(r => setTimeout(r, 800));
  // In demo mode, create a local object URL
  return URL.createObjectURL(file);
}

export function validateImageFile(file: File): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (!allowedTypes.includes(file.type)) return 'Please upload a JPEG, PNG, or WebP image.';
  if (file.size > maxSize) return 'Image must be smaller than 10MB.';
  return null;
}
