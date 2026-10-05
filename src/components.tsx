import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  ExternalLink,
  Images,
  Layers3,
  LocateFixed,
  Map as MapIcon,
  MapPinned,
  Menu,
  MessageCircle,
  Minus,
  Navigation,
  Navigation2,
  Phone,
  Plus,
  RotateCcw,
  Route,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Target,
  UserRound,
  X,
} from 'lucide-react'
import { Link, useNavigate } from './App'
import { places } from './data'
import type { Place } from './data'
import { MarkLogo } from './icons'

export const iconMap = {
  search: Search,
  navigate: Navigation,
  map: MapIcon,
  places: Building2,
  gallery: Images,
  guide: Sparkles,
  resources: CircleHelp,
  compass: Compass,
  route: Route,
  location: LocateFixed,
  arrow: ArrowRight,
  external: ExternalLink,
  clock: Clock3,
  accessibility: Accessibility,
  layers: Layers3,
  plus: Plus,
  minus: Minus,
  reset: RotateCcw,
  close: X,
  menu: Menu,
  back: ArrowLeft,
  help: CircleHelp,
  phone: Phone,
  emergency: ShieldAlert,
  profile: UserRound,
  target: Target,
} as const

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="MAPolyGo home">
      <span className="brand-mark"><MarkLogo size={38} /></span>
      {!compact && <span className="brand-copy"><strong>MAPolyGo</strong><small>Smart campus navigation</small></span>}
    </Link>
  )
}

const navItems = [
  { href: '/', label: 'Home', icon: Compass },
  { href: '/explore', label: 'Explore', icon: Building2 },
  { href: '/navigate', label: 'Navigate', icon: Navigation },
  { href: '/gallery', label: 'Gallery', icon: Images },
  { href: '/guide', label: 'Guide', icon: Sparkles },
]

export function AppShell({ children, active = '/' }: { children: React.ReactNode; active?: string }) {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="sidebar-label">Wayfinding desk</div>
        <nav className="side-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            const selected = active === item.href || (item.href !== '/' && active.startsWith(item.href))
            return <Link key={item.href} href={item.href} className={`side-link ${selected ? 'active' : ''}`}><Icon size={18} strokeWidth={selected ? 2.4 : 1.9} /><span>{item.label}</span>{selected && <span className="active-pip" />}</Link>
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-tip">
          <span className="tip-icon"><Sparkles size={16} /></span>
          <div><strong>New here?</strong><p>Start at the Main Gate and let MAPolyGo orient you.</p><Link href="/resources">Visitor guide <ArrowUpRight size={13} /></Link></div>
        </div>
        <Link href="/resources" className="side-link muted"><CircleHelp size={18} /><span>Help & resources</span></Link>
        <div className="sidebar-footer"><span className="status-dot" /> Approximate campus map <span className="footer-year">2026</span></div>
      </aside>
      <div className="mobile-header">
        <Brand />
        <button className="icon-button" aria-label="Open navigation" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
      {mobileOpen && <div className="mobile-menu"><div className="mobile-menu-inner">{navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="mobile-menu-link">{item.label}<ChevronRight size={16} /></Link>)}<Link href="/resources" onClick={() => setMobileOpen(false)} className="mobile-menu-link">Help & resources<ChevronRight size={16} /></Link></div></div>}
      <main className="main-content">{children}</main>
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{navItems.slice(0, 5).map((item) => { const Icon = item.icon; const selected = active === item.href || (item.href !== '/' && active.startsWith(item.href)); return <Link key={item.href} href={item.href} className={selected ? 'active' : ''}><Icon size={19} /><span>{item.label}</span></Link> })}</nav>
    </div>
  )
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <header className="page-header"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</header>
}

export function Button({ children, href, variant = 'primary', icon, onClick, type = 'button', disabled = false, className = '' }: { children: React.ReactNode; href?: string; variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; icon?: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; className?: string }) {
  const classes = `button button-${variant} ${className}`
  if (href) return <Link href={href} className={classes}>{children}{icon}</Link>
  return <button type={type} className={classes} onClick={onClick} disabled={disabled}>{children}{icon}</button>
}

export function Chip({ children, tone = 'default', icon }: { children: React.ReactNode; tone?: 'default' | 'teal' | 'coral' | 'blue' | 'gold'; icon?: React.ReactNode }) {
  return <span className={`chip chip-${tone}`}>{icon}{children}</span>
}

export function SearchBox({ value, onChange, placeholder = 'Search buildings, services, landmarks…' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="search-box"><Search size={18} /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} />{value && <button aria-label="Clear search" onClick={() => onChange('')}><X size={15} /></button>}<kbd>⌘ K</kbd></label>
}

export function PlaceCard({ place, compact = false, onSelect }: { place: Place; compact?: boolean; onSelect?: (place: Place) => void }) {
  const destination = `/place/${place.id}`
  return <article className={`place-card ${compact ? 'compact' : ''}`}>
    <div className="place-accent" style={{ background: place.accent }} />
    <div className="place-card-body">
      <div className="place-card-top"><Chip tone="default">{place.category}</Chip><span className="distance-label"><Navigation2 size={13} /> {place.distance}</span></div>
      <Link href={destination} className="place-title">{place.name}<ArrowUpRight size={15} /></Link>
      {!compact && <p>{place.description}</p>}
      <div className="place-meta"><span className={place.status === 'Closes soon' ? 'status-warning' : 'status-open'}><span className="status-dot" /> {place.status}</span><span><Accessibility size={13} /> {place.accessibility.split(' ')[0]}</span></div>
      <div className="place-actions"><Button href={`/navigate?to=${place.id}`} variant="secondary" icon={<ArrowRight size={15} />}>Route here</Button>{onSelect && <button className="card-link" onClick={() => onSelect(place)}>Show on map</button>}</div>
    </div>
  </article>
}

export function MapCanvas({ selectedId, onSelect, route = false, className = '' }: { selectedId?: string; onSelect?: (id: string) => void; route?: boolean; className?: string }) {
  const [zoom, setZoom] = React.useState(1)
  const [satellite, setSatellite] = React.useState(false)
  return <div className={`map-canvas ${satellite ? 'satellite' : ''} ${className}`}>
    <div className="map-grid" />
    <div className="map-water water-a" /><div className="map-water water-b" />
    <div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" />
    <div className="map-park park-a" /><div className="map-park park-b" />
    <div className="map-controls"><button aria-label="Toggle map style" onClick={() => setSatellite(!satellite)}><Layers3 size={16} /></button><button aria-label="Zoom in" onClick={() => setZoom(Math.min(1.2, zoom + .1))}><Plus size={16} /></button><button aria-label="Zoom out" onClick={() => setZoom(Math.max(.8, zoom - .1))}><Minus size={16} /></button></div>
    <div className="map-legend"><span><i className="legend-line teal" /> Campus walking path</span><span><i className="legend-dot" /> Your location</span></div>
    {route && <svg className="route-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M17 77 C28 70, 32 53, 46 47 S55 35, 43 37" /></svg>}
    <div className="user-marker" title="Approximate demo start"><span><LocateFixed size={14} /></span></div>
    <span className="map-zoom-badge">{Math.round(zoom * 100)}%</span>
    {places.map((place) => <button key={place.id} className={`map-marker ${selectedId === place.id ? 'selected' : ''}`} style={{ left: `${place.position.left}%`, top: `${place.position.top}%`, '--marker-accent': place.accent } as React.CSSProperties} onClick={() => onSelect?.(place.id)} aria-label={`Show ${place.name}`}><span className="marker-pin"><MapPinned size={14} /></span><span className="marker-label">{place.shortName}</span></button>)}
    <span className="map-note note-one">central academic walk</span><span className="map-note note-two">student village</span>
  </div>
}

export function SelectField({ label, value, onChange, options, icon = <MapPinned size={17} /> }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; icon?: React.ReactNode }) {
  return <label className="select-field"><span className="field-label">{icon}{label}</span><span className="select-wrap"><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Select a place…</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={17} /></span></label>
}

export function EmptyState({ icon: Icon = Search, title, description, action }: { icon?: typeof Search; title: string; description: string; action?: React.ReactNode }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={22} /></span><h3>{title}</h3><p>{description}</p>{action}</div>
}

export function SectionLabel({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="section-label"><h2>{children}</h2>{action}</div>
}

export function StatStrip() {
  return <div className="stat-strip"><div><strong>8</strong><span>sample places mapped</span></div><div><strong>24/7</strong><span>campus access</span></div><div><strong>1</strong><span>clearer wayfinding system</span></div></div>
}

export function Toast({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return <div className="toast"><span className="toast-check"><Check size={15} /></span><span>{children}</span>{onClose && <button onClick={onClose} aria-label="Close notification"><X size={15} /></button>}</div>
}

import * as React from 'react'
