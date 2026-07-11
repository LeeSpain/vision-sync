// Single source of truth for Vision-Sync transactional email: senders, the
// admin inbox, and HTML escaping. No literal addresses anywhere else.

export const EMAIL = {
  domain: 'vision-sync.co',
  from: {
    leads: 'Vision-Sync <leads@vision-sync.co>',
    quotes: 'Vision-Sync Quotes <quotes@vision-sync.co>',
    hello: 'Vision-Sync <hello@vision-sync.co>',
  },
} as const;

/**
 * The inbox that receives internal admin notifications (new leads, new quotes).
 *
 * Sourced ONLY from the ADMIN_EMAIL secret — there is intentionally no default.
 * The previous hardcoded defaults (lee@vision-sync.com / .co) are dead
 * addresses, so falling back to one would silently drop notifications into a
 * void. Instead this throws loudly when ADMIN_EMAIL is unset; callers that need
 * the admin inbox will surface a clear configuration error rather than
 * "succeeding" while emailing nobody.
 */
export function adminInbox(): string {
  const value = Deno.env.get('ADMIN_EMAIL');
  if (!value) {
    throw new Error(
      'ADMIN_EMAIL is not configured — refusing to send admin notifications to a dead address.',
    );
  }
  return value;
}

/**
 * Escape a value for safe interpolation into an HTML email body. Accepts unknown
 * so any field can be wrapped (null/undefined → empty string; numbers coerced).
 *
 * Use for every user-supplied string placed inside HTML — NOT for email subjects
 * or headers (To/Reply-To), which are not HTML and must stay raw.
 */
export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
