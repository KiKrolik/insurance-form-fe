export function getApiUrl(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BE_API_URL) {
    return import.meta.env.VITE_BE_API_URL;
  }
  return process.env.VITE_BE_API_URL || 'http://localhost:8080';
}