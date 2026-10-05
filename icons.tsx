import type { SVGProps } from 'react'

export function MarkLogo({ size = 36, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <rect width="40" height="40" rx="13" fill="currentColor" />
      <path d="M20 30.2s7-6.8 7-12.2a7 7 0 1 0-14 0c0 5.4 7 12.2 7 12.2Z" fill="white" fillOpacity=".96" />
      <circle cx="20" cy="18" r="2.6" fill="currentColor" />
      <path d="M10.5 31.3c2.7-2 5.8-2.9 9.5-2.9s6.8.9 9.5 2.9" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity=".82" />
    </svg>
  )
}

export function RouteGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 34" fill="none" aria-hidden="true">
      <path d="M2 29C18 29 15 5 33 5s16 23 35 23" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" />
      <circle cx="2" cy="29" r="3" fill="currentColor" />
      <circle cx="68" cy="28" r="3" fill="currentColor" />
    </svg>
  )
}
