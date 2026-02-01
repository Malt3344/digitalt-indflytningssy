// Admin emails that get unlimited free downloads
// Set via ADMIN_EMAILS environment variable (comma-separated)
// Falls back to hardcoded list for backwards compatibility
const envAdminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || []

export const ADMIN_EMAILS = envAdminEmails.length > 0 
  ? envAdminEmails 
  : ['malthe.schwartz.waluga@gmail.com']

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}
