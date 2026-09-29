/** DrishtiGuard eye-and-target logo, drawn in the current text colour. */
export function BrandMark({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 44" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 22C10 10 20 4 32 4s22 6 29 18c-7 12-17 18-29 18S10 34 3 22Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M9 12c3-2.5 6-4.4 9.5-5.6M55 12c-3-2.5-6-4.4-9.5-5.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" opacity=".55" />
      <circle cx="32" cy="22" r="12" fill="currentColor" opacity=".16" />
      <circle cx="32" cy="22" r="10.5" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="32" cy="22" r="5.5" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="32" cy="22" r="2" fill="currentColor" />
      <path d="M32 8v6M32 30v6M18 22h6M40 22h6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
