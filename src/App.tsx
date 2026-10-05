import * as React from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  ExternalLink,
  Flag,
  Info,
  LocateFixed,
  Map as MapIcon,
  MessageCircle,
  Navigation,
  Navigation2,
  Phone,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  UserRound,
  X,
} from 'lucide-react'
import { AppShell, Button, Chip, EmptyState, MapCanvas, PageHeader, PlaceCard, SearchBox, SectionLabel, SelectField, StatStrip, Toast } from './components'
import { faqs, galleryItems, getPlace, getRouteSteps, places, popularPlaceIds, type Category, categories } from './data'

export function useNavigate() {
  return (href: string) => {
    const next = href.startsWith('/') ? href : `/${href}`
    window.history.pushState({}, '', next)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}

export function Link({ href, children, className = '', onClick, 'aria-label': ariaLabel }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void; 'aria-label'?: string }) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('/')) {
      event.preventDefault()
      window.history.pushState({}, '', href)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    onClick?.()
  }
  return <a href={href} className={className} onClick={handleClick} aria-label={ariaLabel}>{children}</a>
}

type RouteInfo = { from: string; to: string; distance: string; duration: string }

export default function App() {
  const [path, setPath] = useState(getPath())
  const [routeInfo, setRouteInfo] = useState<RouteInfo>({ from: 'library', to: 'science', distance: '540 m', duration: '7 min' })
  useEffect(() => { const sync = () => setPath(getPath()); window.addEventListener('popstate', sync); window.addEventListener('hashchange', sync); return () => { window.removeEventListener('popstate', sync); window.removeEventListener('hashchange', sync) } }, [])
  const route = path.split('?')[0]
  const placeId = route.startsWith('/place/') ? route.split('/')[2] : undefined
  const page = route === '/' || route === '' ? <HomePage onRoute={setRouteInfo} />
    : route === '/explore' ? <ExplorePage />
    : route === '/navigate' ? <NavigatePage initialTo={getQuery('to')} onRoute={setRouteInfo} />
    : route === '/directions' ? <DirectionsPage routeInfo={routeInfo} onRoute={setRouteInfo} />
    : route === '/gallery' ? <GalleryPage />
    : route === '/guide' ? <GuidePage />
    : route === '/resources' ? <ResourcesPage />
    : route.startsWith('/place/') ? <PlacePage id={placeId} onRoute={setRouteInfo} />
    : <HomePage onRoute={setRouteInfo} />
  return <AppShell active={route}>{page}</AppShell>
}

function HomePage({ onRoute }: { onRoute: (route: RouteInfo) => void }) {
  const [search, setSearch] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('library')
  const navigate = useNavigate()
  const matches = places.filter((place) => `${place.name} ${place.category}`.toLowerCase().includes(search.toLowerCase())).slice(0, 4)
  const planRoute = () => { const destination = getPlace(to); onRoute({ from: from || 'market', to: destination.id, distance: destination.id === 'library' ? '1.1 km' : destination.distance, duration: destination.id === 'library' ? '14 min' : '9 min' }); navigate('/directions') }
  return <div className="home-page">
    <section className="hero-section">
      <div className="hero-copy"><Chip tone="teal" icon={<span className="live-dot" />}>Moshood Abiola Polytechnic · Abeokuta</Chip><h1>Find your way<br /><em>with confidence.</em></h1><p>Clear walking directions, campus landmarks, and a calmer way to get where you need to be.</p><div className="hero-actions"><Button href="/navigate" icon={<ArrowRight size={17} />}>Plan a route</Button><Button href="/explore" variant="secondary" icon={<ArrowUpRight size={17} />}>Explore campus</Button></div><div className="hero-note"><span className="note-mark"><LocateFixed size={14} /></span><span><strong>Start with where you are.</strong> We’ll handle the rest.</span></div></div>
      <div className="hero-map-wrap"><MapCanvas route selectedId="library" /><div className="hero-map-card"><div className="mini-avatar"><Navigation2 size={16} /></div><div><strong>Campus map preview</strong><span>8 sample places in view</span></div><span className="hero-map-arrow"><ArrowUpRight size={15} /></span></div></div>
    </section>
    <section className="quick-plan-section"><div className="quick-plan-copy"><div className="eyebrow">A quicker first step</div><h2>Where are you headed?</h2><p>Pick two places and get a simple walking plan. No guesswork.</p><div className="quick-points"><span><Check size={14} /> Distance + time</span><span><Check size={14} /> Step-by-step route</span></div></div><div className="quick-plan-card"><SelectField label="Starting point" value={from} onChange={setFrom} options={places.map((place) => ({ value: place.id, label: place.name }))} icon={<Target size={17} />} /><div className="route-connector"><span /><button onClick={() => { const oldFrom = from || 'market'; setFrom(to); setTo(oldFrom) }} aria-label="Swap route locations"><RotateCcw size={15} /></button><span /></div><SelectField label="Destination" value={to} onChange={setTo} options={places.map((place) => ({ value: place.id, label: place.name }))} icon={<Flag size={17} />} /><Button onClick={planRoute} className="full-width" icon={<ArrowRight size={16} />}>Show my route</Button></div></section>
    <section className="home-content"><div className="home-content-main"><SectionLabel action={<Button href="/explore" variant="ghost" icon={<ArrowRight size={14} />}>View directory</Button>}>Popular places</SectionLabel><div className="popular-grid">{popularPlaceIds.map((id) => <PlaceCard key={id} place={getPlace(id)} compact />)}</div></div><aside className="home-aside"><div className="aside-card aside-guide"><span className="aside-icon"><Sparkles size={18} /></span><div className="eyebrow">Need a little help?</div><h3>Ask the campus guide.</h3><p>Try “Where is the health center?” or “How do I get to the library?”</p><Button href="/guide" variant="secondary" icon={<ArrowRight size={15} />}>Open guide</Button></div><div className="aside-card aside-search"><div className="eyebrow">Search the campus</div><SearchBox value={search} onChange={setSearch} /><div className="search-results">{search && (matches.length ? matches.map((place) => <Link key={place.id} href={`/place/${place.id}`} className="search-result"><span className="result-dot" style={{ background: place.accent }} /><span>{place.name}</span><ChevronRight size={14} /></Link>) : <span className="no-results">No places match yet.</span>)}</div></div></aside></section>
    <StatStrip />
  </div>
}

function ExplorePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<'All' | Category>('All')
  const filtered = useMemo(() => places.filter((place) => (category === 'All' || place.category === category) && `${place.name} ${place.shortName} ${place.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())), [search, category])
  return <div className="page-shell"><PageHeader eyebrow="Campus directory" title="Explore campus" description="Everything you need, organized around how you actually move through MAPoly." action={<Button href="/navigate" icon={<Navigation size={16} />}>Plan a route</Button>} /><div className="directory-toolbar"><SearchBox value={search} onChange={setSearch} /><div className="filter-row"><SlidersIcon /><div className="filter-pills">{categories.map((item) => <button key={item} className={`filter-pill ${category === item ? 'active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}</div><span className="result-count">{filtered.length} places</span></div></div><div className="explore-layout"><div className="directory-grid">{filtered.length ? filtered.map((place) => <PlaceCard key={place.id} place={place} />) : <EmptyState title="No places found" description="Try a wider search or switch to another category." action={<Button variant="secondary" onClick={() => { setSearch(''); setCategory('All') }}>Reset filters</Button>} />}</div><aside className="explore-map-panel"><div className="panel-heading"><div><div className="eyebrow">Map view</div><h2>See the campus at a glance</h2></div><Chip tone="teal">Approximate map</Chip></div><MapCanvas selectedId={filtered[0]?.id} onSelect={(id) => navigate(`/place/${id}`)} /><div className="map-panel-foot"><span><span className="status-dot" /> Tap a marker to explore</span><Link href="/navigate">Open route planner <ArrowRight size={14} /></Link></div></aside></div></div>
}

function NavigatePage({ initialTo, onRoute }: { initialTo?: string; onRoute: (route: RouteInfo) => void }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState(initialTo || 'library')
  const [locationState, setLocationState] = useState<'idle' | 'requesting' | 'ready' | 'blocked'>('idle')
  const [selected, setSelected] = useState(to)
  const navigate = useNavigate()
  const destination = getPlace(to)
  const canRoute = Boolean(to && (from || locationState === 'ready'))
  const requestLocation = () => {
    if (!navigator.geolocation) { setLocationState('blocked'); return }
    setLocationState('requesting')
    navigator.geolocation.getCurrentPosition(() => setLocationState('ready'), () => setLocationState('blocked'), { maximumAge: 60000, timeout: 5000 })
  }
  const route = () => { onRoute({ from: from || 'market', to, distance: destination.id === 'library' && !from ? '1.1 km' : destination.distance, duration: destination.id === 'library' && !from ? '14 min' : '9 min' }); navigate('/directions') }
  return <div className="page-shell"><PageHeader eyebrow="Route planner" title="Start with where you are." description="Choose a place, use your current location, or pick the Main Gate as your easy fallback." action={<Chip tone="blue" icon={<Info size={14} />}>Walking routes only</Chip>} /><div className="navigate-layout"><section className="planner-card"><div className="planner-top"><div><div className="eyebrow">Build your route</div><h2>Two points. One clear plan.</h2></div><span className="planner-step">01 <span>/</span> 02</span></div><SelectField label="Starting point" value={from} onChange={(value) => { setFrom(value); setLocationState('idle') }} options={places.map((place) => ({ value: place.id, label: place.name }))} icon={<Target size={17} />} /><button className={`location-option ${locationState === 'ready' ? 'ready' : ''}`} onClick={requestLocation}><span className="location-option-icon"><LocateFixed size={16} /></span><span><strong>{locationState === 'ready' ? 'Location permission granted · demo start ready' : locationState === 'requesting' ? 'Checking your location…' : 'Use my current location'}</strong><small>{locationState === 'ready' ? 'Route data will use the Main Gate demo fallback' : locationState === 'requesting' ? 'Allow location access when your browser asks' : 'Fastest way to start if you’re already on campus'}</small></span><span className="location-option-check">{locationState === 'ready' && <Check size={15} />}</span></button>{locationState === 'blocked' && <div className="inline-warning"><Info size={14} /> Location access is unavailable. Pick a place instead.</div>}<div className="planner-divider"><span /><button onClick={() => { const oldFrom = from || 'market'; setFrom(to); setTo(oldFrom) }} aria-label="Reverse route"><RotateCcw size={15} /></button><span /></div><SelectField label="Destination" value={to} onChange={(value) => { setTo(value); setSelected(value) }} options={places.map((place) => ({ value: place.id, label: place.name }))} icon={<Flag size={17} />} /><div className="selected-preview"><div className="selected-preview-art" style={{ backgroundImage: `url(${destination.image})` }} /><div><span className="eyebrow">Selected destination</span><strong>{destination.name}</strong><span>{destination.distance} · {destination.status}</span></div><Link href={`/place/${destination.id}`} aria-label="View destination details"><ArrowUpRight size={16} /></Link></div><Button className="full-width planner-cta" onClick={route} disabled={!canRoute} icon={<ArrowRight size={16} />}>Get walking directions</Button><p className="planner-hint"><ShieldAlert size={14} /> Prototype route data is curated for the MAPoly campus.</p></section><section className="planner-map"><div className="map-topline"><div><div className="eyebrow">Campus map</div><h2>Find your bearings</h2></div><div className="map-top-actions"><button className="map-action active"><MapIcon size={15} /> Map</button><button className="map-action"><LayersIcon /> Layers</button></div></div><MapCanvas selectedId={selected} onSelect={(id) => { setSelected(id); setTo(id) }} route /><div className="map-underbar"><span><span className="status-dot" /> Approximate route preview</span><span>Static campus preview</span></div></section></div></div>
}

function DirectionsPage({ routeInfo, onRoute }: { routeInfo: RouteInfo; onRoute: (route: RouteInfo) => void }) {
  const from = getPlace(routeInfo.from)
  const to = getPlace(routeInfo.to)
  const steps = getRouteSteps(routeInfo.from, routeInfo.to)
  const [completed, setCompleted] = useState(1)
  const navigate = useNavigate()
  return <div className="page-shell"><div className="back-link"><button onClick={() => navigate('/navigate')}><ArrowLeft size={15} /> Back to planner</button></div><div className="directions-heading"><div><div className="eyebrow">Walking directions</div><h1>Follow the teal line.</h1><p>{from.name} <ArrowRight size={14} /> {to.name}</p></div><div className="directions-actions"><Button variant="secondary" onClick={() => { onRoute({ ...routeInfo, from: routeInfo.to, to: routeInfo.from }); navigate('/directions') }} icon={<RotateCcw size={15} />}>Reverse</Button><Button variant="ghost" onClick={() => navigate('/navigate')}>Adjust route</Button></div></div><div className="route-summary-card"><div className="route-endpoints"><span className="endpoint-dot start" /><div><small>Starting from</small><strong>{from.name}</strong></div><div className="endpoint-line" /><span className="endpoint-dot end" /><div><small>Arriving at</small><strong>{to.name}</strong></div></div><div className="route-summary-stats"><div><Clock3 size={16} /><strong>{routeInfo.duration}</strong><span>walking time</span></div><div><Navigation2 size={16} /><strong>{routeInfo.distance}</strong><span>total distance</span></div><div><Accessibility size={16} /><strong>Easy</strong><span>route profile</span></div></div></div><div className="directions-layout"><section className="steps-card"><div className="steps-header"><div><div className="eyebrow">Step by step</div><h2>{completed === steps.length ? 'You’ve arrived.' : `${completed} of ${steps.length} steps`}</h2></div><span className="progress-ring"><strong>{Math.round((completed / steps.length) * 100)}%</strong></span></div><div className="progress-bar"><span style={{ width: `${(completed / steps.length) * 100}%` }} /></div><div className="steps-list">{steps.map((step) => <button key={step.index} className={`step-row ${step.index <= completed ? 'complete' : ''} ${step.index === completed + 1 ? 'next' : ''}`} onClick={() => setCompleted(step.index)}><span className={`step-icon step-${step.tone}`}>{step.index <= completed ? <Check size={16} /> : step.index === steps.length ? <Flag size={16} /> : <Navigation2 size={16} />}</span><span className="step-copy"><strong>{step.title}</strong><span>{step.detail}</span></span><span className="step-distance">{step.distance}</span><ChevronRight size={15} /></button>)}</div><Button variant="secondary" onClick={() => setCompleted(1)} icon={<RotateCcw size={15} />}>Reset progress</Button></section><aside className="directions-map"><MapCanvas route selectedId={to.id} /><div className="map-arrival-card"><span className="status-dot" /><div><strong>Route is ready</strong><span>Stay on the central academic walk</span></div><button aria-label="Share route"><ExternalLink size={15} /></button></div></aside></div></div>
}

function PlacePage({ id, onRoute }: { id?: string; onRoute: (route: RouteInfo) => void }) {
  const place = getPlace(id)
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  return <div className="page-shell place-page"><div className="back-link"><button onClick={() => navigate('/explore')}><ArrowLeft size={15} /> Back to explore</button></div><div className="place-detail-layout"><section><div className="place-detail-image" style={{ backgroundImage: `url(${place.image})` }}><div className="image-overlay"><Chip tone="teal">{place.category}</Chip><button aria-label="Save place" className={`save-button ${saved ? 'saved' : ''}`} onClick={() => setSaved(!saved)}>{saved ? <Check size={17} /> : <BookOpen size={17} />}</button></div></div><div className="place-detail-copy"><div className="eyebrow">Campus place</div><h1>{place.name}</h1><p className="place-lead">{place.description}</p><div className="detail-actions"><Button href={`/navigate?to=${place.id}`} icon={<Navigation size={16} />}>Route here</Button><Button variant="secondary" onClick={() => navigate(`/navigate?to=${place.id}`)} icon={<MapIcon size={16} />}>Show on map</Button></div></div></section><aside className="place-detail-aside"><div className="detail-fact-card"><div className="detail-fact"><span className="fact-icon teal-bg"><Clock3 size={17} /></span><div><small>Hours</small><strong>{place.hours}</strong><span className="status-open"><span className="status-dot" /> {place.status}</span></div></div><div className="detail-fact"><span className="fact-icon blue-bg"><Accessibility size={17} /></span><div><small>Access</small><strong>{place.accessibility}</strong><Link href="/resources">Accessibility guide <ArrowUpRight size={13} /></Link></div></div><div className="detail-fact"><span className="fact-icon coral-bg"><Navigation2 size={17} /></span><div><small>From your current view</small><strong>{place.distance} away</strong><span>About 8 min walking</span></div></div></div><div className="detail-note"><Info size={16} /><div><strong>Good to know</strong><p>Opening hours and access notes are helpful estimates. Confirm with campus staff if you’re visiting for a specific service.</p></div></div></aside></div><div className="related-section"><SectionLabel action={<Button href="/explore" variant="ghost" icon={<ArrowRight size={14} />}>View all places</Button>}>You might also need</SectionLabel><div className="related-grid">{places.filter((item) => item.id !== place.id).slice(0, 3).map((item) => <PlaceCard key={item.id} place={item} compact />)}</div></div></div>
}

function GalleryPage() {
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<(typeof galleryItems)[number] | null>(null)
  const galleryCategories = ['All', 'Campus life', 'Study spots', 'Landmarks']
  const filtered = galleryItems.filter((item) => category === 'All' || item.category === category)
  useEffect(() => {
    if (selected) {
      previousFocusRef.current = document.activeElement as HTMLElement
      closeRef.current?.focus()
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setSelected(null)
        if (event.key === 'Tab') { event.preventDefault(); closeRef.current?.focus() }
      }
      document.addEventListener('keydown', onKey)
      return () => document.removeEventListener('keydown', onKey)
    }
    previousFocusRef.current?.focus()
    previousFocusRef.current = null
  }, [selected])
  return <div className="page-shell"><PageHeader eyebrow="See the place" title="Campus gallery" description="A visual feel for the routes, spaces, and small moments that make MAPoly home." action={<Button href="/explore" variant="secondary" icon={<ArrowRight size={16} />}>Explore places</Button>} /><div className="gallery-tabs">{galleryCategories.map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="gallery-grid">{filtered.map((item, index) => <button key={item.id} className={`gallery-tile tile-${index % 5}`} onClick={() => setSelected(item)}><img src={item.image} alt="" /><span className="gallery-gradient" /><span className="gallery-copy"><small>{item.category}</small><strong>{item.title}</strong><span>{item.caption}</span></span><span className="gallery-open"><ArrowUpRight size={16} /></span></button>)}</div>{selected && <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={() => setSelected(null)}><button ref={closeRef} className="lightbox-close" aria-label="Close gallery" onClick={() => setSelected(null)}><X size={20} /></button><div className="lightbox-card" onClick={(event) => event.stopPropagation()}><img src={selected.image} alt="" /><div><Chip tone="teal">{selected.category}</Chip><h2>{selected.title}</h2><p>{selected.caption}</p></div></div></div>}</div>
}

function GuidePage() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ from: 'guide' | 'you'; text: string }>>([{ from: 'guide', text: 'Hi, I’m your MAPoly campus guide. Tell me what you’re looking for, and I’ll point you in the right direction.' }])
  const prompts = ['Where is the library?', 'I’m new here — where do I start?', 'How do I get to the health center?']
  const submit = (text = message) => { if (!text.trim()) return; setMessages((current) => [...current, { from: 'you', text }, { from: 'guide', text: replyFor(text) }]); setMessage('') }
  return <div className="page-shell"><PageHeader eyebrow="Ask MAPolyGo" title="Your campus guide, in plain language." description="A helpful conversation layer for finding places, understanding routes, and getting oriented." action={<Chip tone="teal">Prototype guide</Chip>} /><div className="guide-layout"><section className="chat-card"><div className="chat-header"><div className="guide-avatar"><Sparkles size={18} /></div><div><strong>MAPolyGo guide</strong><span>Usually replies in a few seconds</span></div><span className="chat-status"><span className="status-dot" /> Ready</span></div><div className="chat-messages">{messages.map((item, index) => <div key={index} className={`chat-row ${item.from}`}><div className="chat-bubble">{item.text}</div></div>)}</div><div className="suggested-prompts"><span>Try asking</span>{prompts.map((prompt) => <button key={prompt} onClick={() => submit(prompt)}>{prompt}<ArrowUpRight size={13} /></button>)}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); submit() }}><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask about a place or route…" aria-label="Ask the campus guide" /><button aria-label="Send message"><Send size={17} /></button></form></section><aside className="guide-aside"><div className="guide-aside-card"><div className="eyebrow">Good to know</div><h3>Keep it specific.</h3><p>The guide is best for places, walking routes, campus landmarks, and first-time visitor questions.</p><div className="guide-example"><MessageCircle size={16} /><span>“Where is the closest place to print?”</span></div></div><div className="guide-aside-card soft"><div className="eyebrow">Need exact steps?</div><h3>Use the route planner.</h3><p>When you need a route you can follow, we’ll show the time, distance, and every turn.</p><Button href="/navigate" variant="secondary" icon={<ArrowRight size={15} />}>Plan a route</Button></div></aside></div></div>
}

function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState(0)
  return <div className="page-shell"><PageHeader eyebrow="You’re covered" title="Help for the whole visit." description="Useful context for first arrivals, accessibility planning, and the moments when you need a human contact." action={<Button href="/guide" icon={<Sparkles size={16} />}>Ask the guide</Button>} /><div className="resources-grid"><section className="resource-feature"><div className="resource-feature-copy"><Chip tone="teal">First-time visitor</Chip><h2>Start at the Main Gate.</h2><p>Give yourself one easy landmark to remember. From there, you can reach the library, admin offices, student life, and academic blocks without doubling back.</p><Button href="/navigate?to=library" variant="secondary" icon={<ArrowRight size={15} />}>Route from Main Gate</Button></div><div className="resource-route-visual"><div className="route-visual-line" /><div className="route-visual-stop start"><span>01</span><strong>Main Gate</strong></div><div className="route-visual-stop middle"><span>02</span><strong>Central walk</strong></div><div className="route-visual-stop end"><span>03</span><strong>Library court</strong></div></div></section><section className="resource-cards"><div className="resource-card"><span className="resource-icon blue-bg"><Accessibility size={18} /></span><div><h3>Accessibility notes</h3><p>Look for step-free routes, drop-off points, and access notes on every place card.</p><Link href="/explore">Browse accessible places <ArrowRight size={14} /></Link></div></div><div className="resource-card"><span className="resource-icon coral-bg"><ShieldAlert size={18} /></span><div><h3>Urgent help</h3><p>Verified campus contact details are not configured in this prototype. Ask the guide or visit the Student Health Center for the right desk.</p><Link href="/guide">Ask the guide for help <ArrowRight size={14} /></Link></div></div><div className="resource-card"><span className="resource-icon teal-bg"><MapIcon size={18} /></span><div><h3>Map legend</h3><p>Teal pins are places. The teal dashed line is a walking path. A pulsing dot is an approximate demo start.</p><Link href="/navigate">Open map <ArrowRight size={14} /></Link></div></div><div className="resource-card"><span className="resource-icon blue-bg"><BookOpen size={18} /></span><div><h3>Campus directory</h3><p>Jump straight to the places visitors ask for most.</p><Link href="/place/library">Library <ArrowRight size={14} /></Link> <Link href="/place/health">Health center <ArrowRight size={14} /></Link></div></div><div className="resource-card"><span className="resource-icon coral-bg"><Target size={18} /></span><div><h3>Popular destinations</h3><p>Main Gate, OGD Hall, Library, and Student Health Center are good first stops.</p><Link href="/explore">Browse all places <ArrowRight size={14} /></Link></div></div></section></div><div className="faq-section"><SectionLabel action={<span className="faq-caption"><CircleHelp size={15} /> Quick answers for your route</span>}>Frequently asked</SectionLabel><div className="faq-list">{faqs.map((faq, index) => <div key={faq.q} className={`faq-item ${openFaq === index ? 'open' : ''}`}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)}><span>{faq.q}</span><ChevronRight size={17} /></button>{openFaq === index && <p>{faq.a}</p>}</div>)}</div></div></div>
}

function getPath() {
  const hash = window.location.hash.replace(/^#/, '')
  if (hash) return hash.startsWith('/') ? hash : `/${hash}`
  return `${window.location.pathname || '/'}${window.location.search || ''}`
}
function getQuery(key: string) {
  const hashQuery = window.location.hash.split('?')[1]
  const query = hashQuery || window.location.search.replace(/^\?/, '')
  return query ? new URLSearchParams(query).get(key) || undefined : undefined
}
function replyFor(text: string) { const lower = text.toLowerCase(); if (lower.includes('library')) return 'The Salawu Abiola Memorial Library is near the central academic walk. I can open a route for you from the Main Gate, or you can choose your current location in the planner.'; if (lower.includes('health')) return 'The Student Health Center is on the north side of campus. It is marked as “Closes soon” in the directory — route there before you set off.'; return 'Start at the Main Gate, then tell me the building or service you need. I can help you choose a place or open the route planner.' }
function SlidersIcon() { return <span className="filter-icon"><span /><span /><span /></span> }
function LayersIcon() { return <span className="layers-icon"><span /><span /><span /></span> }
