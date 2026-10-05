import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Home, Compass, Navigation, Map as MapIcon, Images, Bot, BookOpen,
  Search, Mic, MicOff, Volume2, Square, ArrowLeft, ArrowRight,
  ArrowUpDown, MapPin, LocateFixed, Navigation2, Clock, Footprints,
  Phone, Clock3, Accessibility, X, ChevronRight, Menu, Eye,
  Building2, GraduationCap, BookOpen as BookIcon, Utensils, BedDouble,
  Dumbbell, Church, HeartPulse, CircleParking, Landmark, PartyPopper,
  AlertTriangle, Info, Sparkles, Send, CornerDownLeft, Share2,
  Layers, Zap, VolumeX, RotateCcw, MapPinOff, Star,
} from "lucide-react";

import {
  PLACES, CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS,
  GALLERY, GALLERY_CATEGORIES, FAQS, POPULAR_DESTINATIONS, RESOURCES,
  MAP_CENTER, MAP_ZOOM,
  type Place, type PlaceCategory, type GalleryItem,
  distanceMeters, formatDistance, walkingTimeMinutes, generateRouteSteps,
} from "./data";
import { useRouter, navigateTo, navigateToPlace } from "./router";
import { CampusMap, fitRouteBounds, type MapHandle } from "./MapView";
import { useGeolocation, useVoiceRecognition, useSpeechSynthesis, type LocationState } from "./hooks";

// ─── Icon Helper ─────────────────────────────────────────────
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GraduationCap, Building2, BookOpen: BookIcon, Utensils, BedDouble,
  Dumbbell, Church, HeartPulse, MapPin, CircleParking, Landmark, PartyPopper,
};

function CategoryIcon({ category, size = 18, className }: { category: PlaceCategory; size?: number; className?: string }) {
  const Icon = ICON_MAP[CATEGORY_ICONS[category]] || MapPin;
  return <Icon size={size} className={className} />;
}

// ─── Chip ────────────────────────────────────────────────────
function Chip({
  children, active, onClick, icon, variant = "default",
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
}) {
  return (
    <button
      className={`chip chip--${variant} ${active ? "chip--active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="chip__icon">{icon}</span>}
      {children}
    </button>
  );
}

// ─── Place Card ──────────────────────────────────────────────
function PlaceCard({ place, onSelect, distance }: { place: Place; onSelect: (id: string) => void; distance?: number }) {
  return (
    <article className="place-card" onClick={() => onSelect(place.id)} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect(place.id); }}
    >
      <div className="place-card__image">
        <img src={place.image} alt={place.name} loading="lazy" />
        <div className="place-card__badge">
          <CategoryIcon category={place.category} size={14} />
          <span>{place.category}</span>
        </div>
      </div>
      <div className="place-card__body">
        <h3 className="place-card__name">{place.name}</h3>
        <p className="place-card__desc">{place.description.slice(0, 90)}…</p>
        <div className="place-card__meta">
          {distance !== undefined && (
            <span className="place-card__dist"><MapPin size={14} /> {formatDistance(distance)}</span>
          )}
          <span className="place-card__time"><Clock3 size={14} /> {place.hours.split(",")[0]}</span>
        </div>
        <div className="place-card__actions">
          <span className="place-card__cta">View details <ChevronRight size={14} /></span>
        </div>
      </div>
    </article>
  );
}

// ─── Bottom Nav (Mobile) ─────────────────────────────────────
const NAV_ITEMS = [
  { route: "home" as const, label: "Home", icon: Home },
  { route: "explore" as const, label: "Explore", icon: Compass },
  { route: "navigate" as const, label: "Route", icon: Navigation },
  { route: "gallery" as const, label: "Gallery", icon: Images },
  { route: "resources" as const, label: "More", icon: BookOpen },
];

function BottomNav({ current, onNavigate }: { current: string; onNavigate: (r: "home" | "explore" | "navigate" | "gallery" | "resources") => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = current === item.route || (item.route === "home" && current === "");
        return (
          <button
            key={item.route}
            className={`bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`}
            onClick={() => onNavigate(item.route)}
            type="button"
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon size={22} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── Sidebar (Desktop) ───────────────────────────────────────
const SIDEBAR_ITEMS = [
  { route: "home" as const, label: "Home", icon: Home },
  { route: "explore" as const, label: "Explore Campus", icon: Compass },
  { route: "navigate" as const, label: "Route Planner", icon: Navigation },
  { route: "directions" as const, label: "Directions", icon: MapIcon },
  { route: "gallery" as const, label: "Gallery", icon: Images },
  { route: "guide" as const, label: "AI Guide", icon: Bot },
  { route: "resources" as const, label: "Resources", icon: BookOpen },
];

function Sidebar({ current, onNavigate }: { current: string; onNavigate: (r: any) => void }) {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar__brand" onClick={() => onNavigate("home")} role="button" tabIndex={0}>
        <div className="sidebar__logo">
          <Navigation2 size={22} />
        </div>
        <div className="sidebar__name">
          <span className="sidebar__title">MAPoly</span>
          <span className="sidebar__subtitle">Smart Routing</span>
        </div>
      </div>
      <nav className="sidebar__nav">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = current === item.route || (item.route === "home" && current === "");
          return (
            <button
              key={item.route}
              className={`sidebar__item ${isActive ? "sidebar__item--active" : ""}`}
              onClick={() => onNavigate(item.route)}
              type="button"
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__badge">
          <Sparkles size={14} />
          <span>Campus Navigation</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Top Bar (Mobile) ────────────────────────────────────────
function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <div className="topbar__logo">
          <Navigation2 size={18} />
        </div>
        <div className="topbar__name">
          <span className="topbar__title">MAPoly</span>
          <span className="topbar__subtitle">Smart Routing</span>
        </div>
      </div>
    </header>
  );
}

// ─── App Shell ───────────────────────────────────────────────
export function App() {
  const router = useRouter();
  const currentRoute = router.param ? "place" : router.route;

  return (
    <div className="app-shell">
      <Sidebar current={currentRoute} onNavigate={navigateTo} />
      <div className="app-main">
        <TopBar />
        <main className="app-content">
          {router.param ? (
            <PlaceDetailPage placeId={router.param} />
          ) : router.route === "home" ? (
            <HomePage />
          ) : router.route === "explore" ? (
            <ExplorePage />
          ) : router.route === "navigate" ? (
            <NavigatePage />
          ) : router.route === "directions" ? (
            <DirectionsPage />
          ) : router.route === "gallery" ? (
            <GalleryPage />
          ) : router.route === "guide" ? (
            <GuidePage />
          ) : router.route === "resources" ? (
            <ResourcesPage />
          ) : (
            <HomePage />
          )}
        </main>
        <BottomNav current={currentRoute} onNavigate={navigateTo} />
      </div>
    </div>
  );
}

// ─── Home Page ───────────────────────────────────────────────
function HomePage() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [showResults, setShowResults] = useState(false);

  const doSearch = useCallback((q: string) => {
    setSearch(q);
    if (q.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    const lower = q.toLowerCase();
    const matched = PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.tags.some((t) => t.toLowerCase().includes(lower)),
    );
    setResults(matched);
    setShowResults(true);
  }, []);

  const popular = POPULAR_DESTINATIONS.map((id) => PLACES.find((p) => p.id === id)).filter(Boolean) as Place[];

  return (
    <div className="page page--home">
      <section className="hero">
        <div className="hero__content">
          <span className="hero__label"><Sparkles size={14} /> Welcome to MAPoly Smart Routing</span>
          <h1 className="hero__title">Find your way around <span className="hero__highlight">Moshood Abiola Polytechnic</span></h1>
          <p className="hero__desc">Real maps, live location, voice directions, and step-by-step routes — all designed to help you navigate campus with confidence.</p>
          <div className="hero__search">
            <Search size={20} className="hero__search-icon" />
            <input
              type="text"
              placeholder="Search for a building, facility, or place…"
              value={search}
              onChange={(e) => doSearch(e.target.value)}
              onFocus={() => search.length >= 2 && setShowResults(true)}
              className="hero__search-input"
              aria-label="Search campus places"
            />
            {search && (
              <button className="hero__search-clear" onClick={() => { setSearch(""); setShowResults(false); }} type="button" aria-label="Clear search">
                <X size={18} />
              </button>
            )}
          </div>
          {showResults && results.length > 0 && (
            <div className="hero__results">
              {results.slice(0, 6).map((place) => (
                <button key={place.id} className="search-result" onClick={() => navigateToPlace(place.id)} type="button">
                  <CategoryIcon category={place.category} size={18} />
                  <div>
                    <span className="search-result__name">{place.name}</span>
                    <span className="search-result__cat">{place.category}</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          )}
          {showResults && results.length === 0 && search.trim().length >= 2 && (
            <div className="hero__results">
              <div className="search-result search-result--empty">
                <Info size={18} />
                <span>No places found for "{search}". Try a different search.</span>
              </div>
            </div>
          )}
          <div className="hero__actions">
            <button className="btn btn--primary" onClick={() => navigateTo("navigate")} type="button">
              <Navigation size={18} /> Plan a Route
            </button>
            <button className="btn btn--secondary" onClick={() => navigateTo("explore")} type="button">
              <Compass size={18} /> Explore Campus
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Popular Destinations</h2>
          <button className="section__link" onClick={() => navigateTo("explore")} type="button">View all <ChevronRight size={16} /></button>
        </div>
        <div className="card-grid">
          {popular.map((place) => (
            <PlaceCard key={place.id} place={place} onSelect={navigateToPlace} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Quick Actions</h2>
        </div>
        <div className="quick-actions">
          <button className="quick-action" onClick={() => navigateTo("navigate")} type="button">
            <div className="quick-action__icon quick-action__icon--blue"><Navigation size={24} /></div>
            <span className="quick-action__label">Plan Route</span>
          </button>
          <button className="quick-action" onClick={() => navigateTo("directions")} type="button">
            <div className="quick-action__icon quick-action__icon--orange"><Footprints size={24} /></div>
            <span className="quick-action__label">Directions</span>
          </button>
          <button className="quick-action" onClick={() => navigateTo("gallery")} type="button">
            <div className="quick-action__icon quick-action__icon--blue"><Images size={24} /></div>
            <span className="quick-action__label">Gallery</span>
          </button>
          <button className="quick-action" onClick={() => navigateTo("guide")} type="button">
            <div className="quick-action__icon quick-action__icon--orange"><Bot size={24} /></div>
            <span className="quick-action__label">AI Guide</span>
          </button>
          <button className="quick-action" onClick={() => navigateTo("resources")} type="button">
            <div className="quick-action__icon quick-action__icon--blue"><BookOpen size={24} /></div>
            <span className="quick-action__label">Resources</span>
          </button>
        </div>
      </section>

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">First Time on Campus?</h2>
        </div>
        <div className="visitor-card">
          <div className="visitor-card__body">
            <h3>New to MAPoly?</h3>
            <p>Check out our visitor guide with everything you need — campus directory, accessibility info, emergency contacts, and FAQs.</p>
            <button className="btn btn--primary" onClick={() => navigateTo("resources")} type="button">
              <Info size={18} /> Visitor Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Explore Page ────────────────────────────────────────────
function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<PlaceCategory | "All">("All");
  const [sortBy, setSortBy] = useState<"name" | "category">("name");

  const filtered = useMemo(() => {
    let list = PLACES;
    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (search.trim().length >= 2) {
      const lower = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower)) ||
          p.description.toLowerCase().includes(lower),
      );
    }
    const sorted = [...list];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    }
    return sorted;
  }, [search, activeCategory, sortBy]);

  return (
    <div className="page page--explore">
      <div className="page__header">
        <h1 className="page__title">Explore Campus</h1>
        <p className="page__desc">Browse all {PLACES.length} campus locations by category or search by name.</p>
      </div>

      <div className="explore-controls">
        <div className="search-bar">
          <Search size={18} className="search-bar__icon" />
          <input
            type="text"
            placeholder="Search places…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-bar__input"
            aria-label="Search places"
          />
          {search && (
            <button className="search-bar__clear" onClick={() => setSearch("")} type="button" aria-label="Clear">
              <X size={16} />
            </button>
          )}
        </div>
        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "category")}>
          <option value="name">Sort by Name</option>
          <option value="category">Sort by Category</option>
        </select>
      </div>

      <div className="category-chips">
        <Chip active={activeCategory === "All"} onClick={() => setActiveCategory("All")}>All ({PLACES.length})</Chip>
        {CATEGORIES.map((cat) => {
          const count = PLACES.filter((p) => p.category === cat).length;
          if (count === 0) return null;
          return (
            <Chip
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              icon={<CategoryIcon category={cat} size={14} />}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </Chip>
          );
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="card-grid">
          {filtered.map((place) => (
            <PlaceCard key={place.id} place={place} onSelect={navigateToPlace} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Compass size={48} />
          <h3>No places found</h3>
          <p>Try adjusting your search or filters.</p>
          <button className="btn btn--secondary" onClick={() => { setSearch(""); setActiveCategory("All"); }} type="button">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Navigate Page ───────────────────────────────────────────
interface RoutePoint {
  lat: number;
  lng: number;
  name: string;
  isUserLocation?: boolean;
}

interface RouteInfo {
  steps: ReturnType<typeof generateRouteSteps>;
  distance: number;
  timeMin: number;
  line: [number, number][];
  from: RoutePoint;
  to: RoutePoint;
}

function NavigatePage() {
  const geo = useGeolocation();
  const mapRef = useRef<MapHandle | null>(null);
  const [from, setFrom] = useState<RoutePoint | null>(null);
  const [to, setTo] = useState<RoutePoint | null>(null);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedMapPlace, setSelectedMapPlace] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  const voice = useVoiceRecognition((text) => {
    const lower = text.toLowerCase().trim();
    const match = PLACES.find(
      (p) => p.name.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase()),
    );
    if (match) {
      setToSearch(match.name);
      setTo({ lat: match.lat, lng: match.lng, name: match.name });
      setShowToDropdown(false);
    } else {
      setToSearch(text);
      // Try partial match
      const partial = PLACES.filter((p) =>
        p.name.toLowerCase().includes(lower) || p.tags.some((t) => lower.includes(t.toLowerCase())),
      );
      if (partial.length > 0) {
        setToSearch(partial[0].name);
        setTo({ lat: partial[0].lat, lng: partial[0].lng, name: partial[0].name });
        setShowToDropdown(false);
      }
    }
  });

  // Auto-use user location as "from" when granted
  useEffect(() => {
    if (geo.location && !from) {
      setFrom({
        lat: geo.location.lat,
        lng: geo.location.lng,
        name: "Your Location",
        isUserLocation: true,
      });
    }
  }, [geo.location]);

  const handleUseLocation = useCallback(() => {
    if (geo.permission === "denied") {
      geo.requestOnce();
      return;
    }
    if (geo.watching) {
      geo.stopWatch();
    } else {
      geo.startWatch();
    }
  }, [geo]);

  useEffect(() => {
    if (geo.location && from?.isUserLocation) {
      setFrom({
        lat: geo.location.lat,
        lng: geo.location.lng,
        name: "Your Location",
        isUserLocation: true,
      });
    }
  }, [geo.location]);

  const computeRoute = useCallback(() => {
    if (!from || !to) {
      setRouteError("Please select both a starting point and a destination.");
      return;
    }
    if (from.lat === to.lat && from.lng === to.lng) {
      setRouteError("Starting point and destination are the same.");
      return;
    }
    setRouteError(null);
    const dist = distanceMeters(from.lat, from.lng, to.lat, to.lng);
    const steps = generateRouteSteps(from.lat, from.lng, to.lat, to.lng, from.name, to.name);
    const line: [number, number][] = steps.map((s) => [s.lat, s.lng]);
    const info: RouteInfo = {
      steps,
      distance: dist,
      timeMin: walkingTimeMinutes(dist),
      line,
      from,
      to,
    };
    setRoute(info);
    // Fit map to show entire route
    setTimeout(() => {
      fitRouteBounds(mapRef.current, line.map(([lat, lng]) => ({ lat, lng })));
    }, 100);
  }, [from, to]);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
    setRoute(null);
  }, [from, to]);

  const reset = useCallback(() => {
    setFrom(null);
    setTo(null);
    setFromSearch("");
    setToSearch("");
    setRoute(null);
    setRouteError(null);
    setSelectedMapPlace(null);
  }, []);

  const filterPlaces = (q: string) => {
    if (q.trim().length < 1) return PLACES.slice(0, 8);
    const lower = q.toLowerCase();
    return PLACES.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.tags.some((t) => t.toLowerCase().includes(lower)),
    ).slice(0, 8);
  };

  const fromResults = filterPlaces(fromSearch);
  const toResults = filterPlaces(toSearch);

  const handleMapSelect = useCallback((id: string) => {
    const place = PLACES.find((p) => p.id === id);
    if (!place) return;
    setSelectedMapPlace(id);
    if (!to) {
      setTo({ lat: place.lat, lng: place.lng, name: place.name });
      setToSearch(place.name);
    } else if (!from) {
      setFrom({ lat: place.lat, lng: place.lng, name: place.name });
      setFromSearch(place.name);
    } else {
      // Replace destination
      setTo({ lat: place.lat, lng: place.lng, name: place.name });
      setToSearch(place.name);
    }
  }, [from, to]);

  return (
    <div className="page page--navigate">
      <div className="page__header">
        <h1 className="page__title">Route Planner</h1>
        <p className="page__desc">Select your start and destination, or use your live location.</p>
      </div>

      <div className="navigate-layout">
        <div className="navigate-panel">
          {/* From */}
          <div className="route-field">
            <label className="route-field__label">
              <span className="route-field__dot route-field__dot--start" />
              From
            </label>
            <div className="route-field__input-row">
              <input
                type="text"
                placeholder="Starting point…"
                value={fromSearch}
                onChange={(e) => { setFromSearch(e.target.value); setShowFromDropdown(true); setFrom(null); }}
                onFocus={() => setShowFromDropdown(true)}
                onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                className="route-field__input"
                aria-label="Starting point"
              />
              {showFromDropdown && fromResults.length > 0 && (
                <div className="route-dropdown">
                  {fromResults.map((p) => (
                    <button
                      key={p.id}
                      className="route-dropdown__item"
                      onClick={() => {
                        setFrom({ lat: p.lat, lng: p.lng, name: p.name });
                        setFromSearch(p.name);
                        setShowFromDropdown(false);
                      }}
                      type="button"
                    >
                      <CategoryIcon category={p.category} size={16} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className={`btn btn--ghost btn--sm ${geo.watching ? "btn--active" : ""}`}
              onClick={handleUseLocation}
              type="button"
            >
              <LocateFixed size={16} />
              {geo.watching ? "Tracking On" : "Use My Location"}
            </button>
            {geo.permission === "denied" && (
              <div className="geo-status geo-status--error">
                <AlertTriangle size={14} />
                <span>{geo.error || "Location permission denied. Select a starting point manually."}</span>
              </div>
            )}
            {geo.watching && geo.location && (
              <div className="geo-status geo-status--ok">
                <MapPin size={14} />
                <span>Live location active — accuracy ±{Math.round(geo.location.accuracy)}m</span>
              </div>
            )}
            {geo.permission !== "granted" && geo.permission !== "denied" && (
              <div className="geo-status geo-status--info">
                <Info size={14} />
                <span>Tap "Use My Location" and allow permission for real-time positioning.</span>
              </div>
            )}
          </div>

          {/* Swap */}
          <button className="route-swap" onClick={swap} type="button" disabled={!from && !to} aria-label="Swap from and to">
            <ArrowUpDown size={18} />
          </button>

          {/* To */}
          <div className="route-field">
            <label className="route-field__label">
              <span className="route-field__dot route-field__dot--end" />
              To
            </label>
            <div className="route-field__input-row">
              <input
                type="text"
                placeholder="Destination…"
                value={toSearch}
                onChange={(e) => { setToSearch(e.target.value); setShowToDropdown(true); setTo(null); }}
                onFocus={() => setShowToDropdown(true)}
                onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                className="route-field__input"
                aria-label="Destination"
              />
              <button
                className={`route-field__mic ${voice.listening ? "route-field__mic--active" : ""}`}
                onClick={() => (voice.listening ? voice.stop() : voice.start())}
                type="button"
                aria-label="Voice search destination"
                disabled={!voice.supported}
                title={voice.supported ? "Search by voice" : "Voice search not supported"}
              >
                {voice.listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              {showToDropdown && toResults.length > 0 && (
                <div className="route-dropdown route-dropdown--right">
                  {toResults.map((p) => (
                    <button
                      key={p.id}
                      className="route-dropdown__item"
                      onClick={() => {
                        setTo({ lat: p.lat, lng: p.lng, name: p.name });
                        setToSearch(p.name);
                        setShowToDropdown(false);
                      }}
                      type="button"
                    >
                      <CategoryIcon category={p.category} size={16} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {voice.listening && (
              <div className="geo-status geo-status--info">
                <Mic size={14} />
                <span>Listening… speak your destination</span>
              </div>
            )}
            {voice.error && (
              <div className="geo-status geo-status--error">
                <AlertTriangle size={14} />
                <span>{voice.error}</span>
              </div>
            )}
            {!voice.supported && (
              <div className="geo-status geo-status--info">
                <Info size={14} />
                <span>Voice search is not supported in your browser. You can type instead.</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="route-actions">
            <button className="btn btn--primary btn--block" onClick={computeRoute} disabled={!from || !to} type="button">
              <Navigation2 size={18} /> Get Directions
            </button>
            <button className="btn btn--ghost btn--sm" onClick={reset} type="button" disabled={!from && !to}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {routeError && (
            <div className="geo-status geo-status--error">
              <AlertTriangle size={14} />
              <span>{routeError}</span>
            </div>
          )}

          {/* Route Summary */}
          {route && (
            <div className="route-summary">
              <div className="route-summary__header">
                <h3>Route Summary</h3>
              </div>
              <div className="route-summary__path">
                <div className="route-summary__point">
                  <span className="route-summary__dot route-summary__dot--start" />
                  <span>{route.from.name}</span>
                </div>
                <div className="route-summary__connector" />
                <div className="route-summary__point">
                  <span className="route-summary__dot route-summary__dot--end" />
                  <span>{route.to.name}</span>
                </div>
              </div>
              <div className="route-summary__stats">
                <div className="route-stat">
                  <Footprints size={18} />
                  <span className="route-stat__value">{formatDistance(route.distance)}</span>
                  <span className="route-stat__label">Distance</span>
                </div>
                <div className="route-stat">
                  <Clock size={18} />
                  <span className="route-stat__value">{route.timeMin} min</span>
                  <span className="route-stat__label">Walking Time</span>
                </div>
                <div className="route-stat">
                  <Navigation2 size={18} />
                  <span className="route-stat__value">{route.steps.length}</span>
                  <span className="route-stat__label">Steps</span>
                </div>
              </div>
              <button
                className="btn btn--primary btn--block"
                onClick={() => navigateTo("directions")}
                type="button"
              >
                <Footprints size={18} /> Start Walking Directions
              </button>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="navigate-map">
          <CampusMap
            places={PLACES}
            selectedPlaceId={selectedMapPlace}
            onSelectPlace={handleMapSelect}
            userLocation={geo.location}
            routeLine={route?.line || null}
            routeStart={route?.from || (from ? from : null)}
            routeEnd={route?.to || (to ? to : null)}
            mapRef={mapRef}
            className="map-canvas"
          />
          <div className="map-legend">
            <div className="map-legend__item"><span className="map-legend__dot map-legend__dot--place" /> Place</div>
            <div className="map-legend__item"><span className="map-legend__dot map-legend__dot--selected" /> Selected</div>
            <div className="map-legend__item"><span className="map-legend__dot map-legend__dot--user" /> Your Location</div>
            <div className="map-legend__item"><span className="map-legend__line" /> Route</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Directions Page ─────────────────────────────────────────
function DirectionsPage() {
  const geo = useGeolocation();
  const mapRef = useRef<MapHandle | null>(null);
  const [from, setFrom] = useState<RoutePoint | null>(null);
  const [to, setTo] = useState<RoutePoint | null>(null);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const tts = useSpeechSynthesis();

  const voice = useVoiceRecognition((text) => {
    const lower = text.toLowerCase().trim();
    const match = PLACES.find((p) => p.name.toLowerCase().includes(lower) || lower.includes(p.name.toLowerCase()));
    if (match) {
      setToSearch(match.name);
      setTo({ lat: match.lat, lng: match.lng, name: match.name });
      setShowToDropdown(false);
    } else {
      const partial = PLACES.filter((p) =>
        p.name.toLowerCase().includes(lower) || p.tags.some((t) => lower.includes(t.toLowerCase())),
      );
      if (partial.length > 0) {
        setToSearch(partial[0].name);
        setTo({ lat: partial[0].lat, lng: partial[0].lng, name: partial[0].name });
        setShowToDropdown(false);
      }
    }
  });

  useEffect(() => {
    if (geo.location && !from) {
      setFrom({ lat: geo.location.lat, lng: geo.location.lng, name: "Your Location", isUserLocation: true });
    }
  }, [geo.location]);

  useEffect(() => {
    if (geo.location && from?.isUserLocation) {
      setFrom({ lat: geo.location.lat, lng: geo.location.lng, name: "Your Location", isUserLocation: true });
    }
  }, [geo.location]);

  const handleUseLocation = useCallback(() => {
    if (geo.permission === "denied") {
      geo.requestOnce();
      return;
    }
    if (geo.watching) geo.stopWatch();
    else geo.startWatch();
  }, [geo]);

  const computeRoute = useCallback(() => {
    if (!from || !to) {
      setRouteError("Select both a start and destination to see directions.");
      return;
    }
    if (from.lat === to.lat && from.lng === to.lng) {
      setRouteError("Start and destination are the same.");
      return;
    }
    setRouteError(null);
    const dist = distanceMeters(from.lat, from.lng, to.lat, to.lng);
    const steps = generateRouteSteps(from.lat, from.lng, to.lat, to.lng, from.name, to.name);
    const line: [number, number][] = steps.map((s) => [s.lat, s.lng]);
    setRoute({ steps, distance: dist, timeMin: walkingTimeMinutes(dist), line, from, to });
    setCurrentStep(0);
    setTimeout(() => fitRouteBounds(mapRef.current, line.map(([lat, lng]) => ({ lat, lng }))), 100);
  }, [from, to]);

  const swap = useCallback(() => {
    setFrom(to);
    setTo(from);
    setRoute(null);
    setCurrentStep(0);
  }, [from, to]);

  const reset = useCallback(() => {
    setFrom(null);
    setTo(null);
    setFromSearch("");
    setToSearch("");
    setRoute(null);
    setCurrentStep(0);
    setRouteError(null);
    tts.stop();
  }, [tts]);

  const filterPlaces = (q: string) => {
    if (q.trim().length < 1) return PLACES.slice(0, 8);
    const lower = q.toLowerCase();
    return PLACES.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.tags.some((t) => t.toLowerCase().includes(lower)),
    ).slice(0, 8);
  };

  const speakAll = useCallback(() => {
    if (!route) return;
    const texts = route.steps.map((s, i) => `Step ${i + 1}. ${s.instruction}. ${s.distance}.`);
    texts.push(`You have arrived at ${route.to.name}.`);
    tts.speakSequence(texts);
  }, [route, tts]);

  const speakCurrent = useCallback(() => {
    if (!route) return;
    const step = route.steps[currentStep];
    if (step) {
      tts.speak(`Step ${currentStep + 1}. ${step.instruction}. ${step.distance}.`);
    }
  }, [route, currentStep, tts]);

  const nextStep = useCallback(() => {
    if (!route) return;
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, route.steps.length - 1);
      const step = route.steps[next];
      if (step) {
        mapRef.current?.flyTo(step.lat, step.lng, 18);
      }
      return next;
    });
  }, [route]);

  const prevStep = useCallback(() => {
    if (!route) return;
    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 0);
      const step = route.steps[next];
      if (step) {
        mapRef.current?.flyTo(step.lat, step.lng, 18);
      }
      return next;
    });
  }, [route]);

  return (
    <div className="page page--directions">
      <div className="page__header">
        <h1 className="page__title">Walking Directions</h1>
        <p className="page__desc">Step-by-step route with voice guidance. Follow along as you walk.</p>
      </div>

      {!route ? (
        <div className="directions-setup">
          <div className="route-field">
            <label className="route-field__label">
              <span className="route-field__dot route-field__dot--start" />
              From
            </label>
            <div className="route-field__input-row">
              <input
                type="text"
                placeholder="Starting point…"
                value={fromSearch}
                onChange={(e) => { setFromSearch(e.target.value); setShowFromDropdown(true); setFrom(null); }}
                onFocus={() => setShowFromDropdown(true)}
                onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                className="route-field__input"
                aria-label="Starting point"
              />
              {showFromDropdown && filterPlaces(fromSearch).length > 0 && (
                <div className="route-dropdown">
                  {filterPlaces(fromSearch).map((p) => (
                    <button
                      key={p.id}
                      className="route-dropdown__item"
                      onClick={() => { setFrom({ lat: p.lat, lng: p.lng, name: p.name }); setFromSearch(p.name); setShowFromDropdown(false); }}
                      type="button"
                    >
                      <CategoryIcon category={p.category} size={16} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className={`btn btn--ghost btn--sm ${geo.watching ? "btn--active" : ""}`} onClick={handleUseLocation} type="button">
              <LocateFixed size={16} />
              {geo.watching ? "Tracking On" : "Use My Location"}
            </button>
            {geo.permission === "denied" && (
              <div className="geo-status geo-status--error">
                <AlertTriangle size={14} />
                <span>{geo.error || "Location denied — select a start manually."}</span>
              </div>
            )}
            {geo.watching && geo.location && (
              <div className="geo-status geo-status--ok">
                <MapPin size={14} />
                <span>Live — accuracy ±{Math.round(geo.location.accuracy)}m</span>
              </div>
            )}
          </div>

          <button className="route-swap" onClick={swap} type="button" disabled={!from && !to}>
            <ArrowUpDown size={18} />
          </button>

          <div className="route-field">
            <label className="route-field__label">
              <span className="route-field__dot route-field__dot--end" />
              To
            </label>
            <div className="route-field__input-row">
              <input
                type="text"
                placeholder="Destination…"
                value={toSearch}
                onChange={(e) => { setToSearch(e.target.value); setShowToDropdown(true); setTo(null); }}
                onFocus={() => setShowToDropdown(true)}
                onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                className="route-field__input"
                aria-label="Destination"
              />
              <button
                className={`route-field__mic ${voice.listening ? "route-field__mic--active" : ""}`}
                onClick={() => (voice.listening ? voice.stop() : voice.start())}
                type="button"
                disabled={!voice.supported}
                aria-label="Voice search destination"
              >
                {voice.listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              {showToDropdown && filterPlaces(toSearch).length > 0 && (
                <div className="route-dropdown route-dropdown--right">
                  {filterPlaces(toSearch).map((p) => (
                    <button
                      key={p.id}
                      className="route-dropdown__item"
                      onClick={() => { setTo({ lat: p.lat, lng: p.lng, name: p.name }); setToSearch(p.name); setShowToDropdown(false); }}
                      type="button"
                    >
                      <CategoryIcon category={p.category} size={16} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {voice.listening && (
              <div className="geo-status geo-status--info">
                <Mic size={14} />
                <span>Listening… speak your destination</span>
              </div>
            )}
          </div>

          <button className="btn btn--primary btn--block" onClick={computeRoute} disabled={!from || !to} type="button">
            <Navigation2 size={18} /> Get Directions
          </button>

          {routeError && (
            <div className="geo-status geo-status--error">
              <AlertTriangle size={14} />
              <span>{routeError}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="directions-active">
          <div className="directions-map">
            <CampusMap
              places={PLACES}
              userLocation={geo.location}
              routeLine={route.line}
              routeStart={route.from}
              routeEnd={route.to}
              mapRef={mapRef}
              className="map-canvas"
            />
          </div>

          <div className="directions-panel">
            <div className="directions-progress">
              <div className="directions-progress__bar">
                <div className="directions-progress__fill" style={{ width: `${((currentStep + 1) / route.steps.length) * 100}%` }} />
              </div>
              <span className="directions-progress__text">Step {currentStep + 1} of {route.steps.length}</span>
            </div>

            <div className="directions-stats">
              <div className="route-stat route-stat--inline">
                <Footprints size={16} />
                <span>{formatDistance(route.distance)}</span>
              </div>
              <div className="route-stat route-stat--inline">
                <Clock size={16} />
                <span>{route.timeMin} min</span>
              </div>
              <div className="route-stat route-stat--inline">
                <Navigation2 size={16} />
                <span>{route.from.name} → {route.to.name}</span>
              </div>
            </div>

            <div className="directions-current">
              <div className="directions-current__num">{currentStep + 1}</div>
              <div className="directions-current__body">
                <p className="directions-current__instruction">{route.steps[currentStep].instruction}</p>
                <span className="directions-current__distance">{route.steps[currentStep].distance}</span>
              </div>
              <button className="directions-current__speak" onClick={speakCurrent} type="button" disabled={!tts.supported} aria-label="Speak this step">
                {tts.speaking ? <Volume2 size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            <div className="directions-voice-controls">
              <button className="btn btn--ghost btn--sm" onClick={speakAll} disabled={!tts.supported} type="button">
                <Volume2 size={16} /> Read All Steps
              </button>
              <button className="btn btn--ghost btn--sm" onClick={() => tts.stop()} disabled={!tts.speaking} type="button">
                <Square size={16} /> Stop Voice
              </button>
              {!tts.supported && (
                <span className="directions-voice-note">Voice output not supported in your browser</span>
              )}
            </div>

            <div className="directions-steps">
              <h4>All Steps</h4>
              {route.steps.map((step, i) => (
                <button
                  key={step.id}
                  className={`direction-step ${i === currentStep ? "direction-step--active" : ""} ${i < currentStep ? "direction-step--done" : ""}`}
                  onClick={() => { setCurrentStep(i); mapRef.current?.flyTo(step.lat, step.lng, 18); }}
                  type="button"
                >
                  <span className="direction-step__num">{i + 1}</span>
                  <span className="direction-step__text">{step.instruction}</span>
                  <span className="direction-step__dist">{step.distance}</span>
                </button>
              ))}
            </div>

            <div className="directions-controls">
              <button className="btn btn--ghost btn--sm" onClick={prevStep} disabled={currentStep === 0} type="button">
                <ArrowLeft size={16} /> Previous
              </button>
              <button className="btn btn--ghost btn--sm" onClick={nextStep} disabled={currentStep === route.steps.length - 1} type="button">
                Next <ArrowRight size={16} />
              </button>
              <button className="btn btn--ghost btn--sm" onClick={swap} type="button">
                <ArrowUpDown size={16} /> Reverse
              </button>
              <button className="btn btn--ghost btn--sm" onClick={reset} type="button">
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Place Detail Page ───────────────────────────────────────
function PlaceDetailPage({ placeId }: { placeId: string }) {
  const place = PLACES.find((p) => p.id === placeId);
  const mapRef = useRef<MapHandle | null>(null);

  if (!place) {
    return (
      <div className="page">
        <div className="empty-state">
          <MapPinOff size={48} />
          <h3>Place not found</h3>
          <p>This location may have been moved or removed.</p>
          <button className="btn btn--primary" onClick={() => navigateTo("explore")} type="button">
            Browse All Places
          </button>
        </div>
      </div>
    );
  }

  const related = PLACES.filter((p) => p.category === place.category && p.id !== place.id).slice(0, 3);

  const routeToHere = () => {
    // Store destination in hash and navigate
    navigateTo("navigate");
    // We'll pass via URL — the navigate page reads from state; user selects
  };

  return (
    <div className="page page--place">
      <button className="back-btn" onClick={() => navigateTo("explore")} type="button">
        <ArrowLeft size={18} /> Back to Explore
      </button>

      <div className="place-detail">
        <div className="place-detail__hero">
          <img src={place.image} alt={place.name} />
          <div className="place-detail__hero-overlay">
            <div className="place-detail__badge">
              <CategoryIcon category={place.category} size={16} />
              <span>{place.category}</span>
            </div>
            <h1 className="place-detail__name">{place.name}</h1>
          </div>
        </div>

        <div className="place-detail__body">
          <div className="place-detail__info">
            <div className="place-detail__section">
              <h3>About</h3>
              <p>{place.description}</p>
            </div>

            <div className="place-detail__meta-grid">
              <div className="place-detail__meta-item">
                <Clock3 size={18} />
                <div>
                  <span className="place-detail__meta-label">Hours</span>
                  <span className="place-detail__meta-value">{place.hours}</span>
                </div>
              </div>
              <div className="place-detail__meta-item">
                <MapPin size={18} />
                <div>
                  <span className="place-detail__meta-label">Address</span>
                  <span className="place-detail__meta-value">{place.address}</span>
                </div>
              </div>
              {place.phone && (
                <div className="place-detail__meta-item">
                  <Phone size={18} />
                  <div>
                    <span className="place-detail__meta-label">Phone</span>
                    <span className="place-detail__meta-value">{place.phone}</span>
                  </div>
                </div>
              )}
              <div className="place-detail__meta-item">
                <Accessibility size={18} />
                <div>
                  <span className="place-detail__meta-label">Accessibility</span>
                  <span className="place-detail__meta-value">{place.accessibility}</span>
                </div>
              </div>
            </div>

            {place.tags.length > 0 && (
              <div className="place-detail__tags">
                {place.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="place-detail__actions">
              <button className="btn btn--primary" onClick={() => navigateTo("navigate")} type="button">
                <Navigation size={18} /> Route to Here
              </button>
              <button className="btn btn--secondary" onClick={() => navigateTo("directions")} type="button">
                <Footprints size={18} /> Walking Directions
              </button>
            </div>
          </div>

          <div className="place-detail__map">
            <CampusMap
              places={[place]}
              selectedPlaceId={place.id}
              mapRef={mapRef}
              className="map-canvas map-canvas--detail"
            />
            <div className="place-detail__coords">
              <MapPin size={14} />
              <span>{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</span>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="place-detail__related">
            <h3>Related Places</h3>
            <div className="card-grid card-grid--compact">
              {related.map((p) => (
                <PlaceCard key={p.id} place={p} onSelect={navigateToPlace} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gallery Page ────────────────────────────────────────────
function GalleryPage() {
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const items = category === "All" ? GALLERY : GALLERY.filter((g) => g.category === category);

  useEffect(() => {
    if (lightbox) {
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightbox(null);
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [lightbox]);

  return (
    <div className="page page--gallery">
      <div className="page__header">
        <h1 className="page__title">Campus Gallery</h1>
        <p className="page__desc">Explore photos of campus buildings, facilities, and landmarks.</p>
      </div>

      <div className="category-chips">
        {GALLERY_CATEGORIES.map((cat) => (
          <Chip key={cat} active={category === cat} onClick={() => setCategory(cat)}>{cat}</Chip>
        ))}
      </div>

      <div className="gallery-grid">
        {items.map((item) => (
          <button
            key={item.id}
            className="gallery-item"
            onClick={() => setLightbox(item)}
            type="button"
          >
            <img src={item.image} alt={item.title} loading="lazy" />
            <div className="gallery-item__overlay">
              <span className="gallery-item__title">{item.title}</span>
              <span className="gallery-item__cat">{item.category}</span>
            </div>
          </button>
        ))}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
          <button className="lightbox__close" onClick={() => setLightbox(null)} type="button" aria-label="Close">
            <X size={24} />
          </button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} alt={lightbox.title} />
            <div className="lightbox__caption">
              <h3>{lightbox.title}</h3>
              <span>{lightbox.category}</span>
              <p>{lightbox.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI Guide Page ───────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTED_PROMPTS = [
  "How do I get to the library?",
  "Where is the nearest cafeteria?",
  "What time does the health center close?",
  "How do I use voice directions?",
  "Is the sports complex open on weekends?",
  "Where can I park on campus?",
];

function GuidePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hello! I'm your MAPoly Smart Routing guide. I can help you find places on campus, understand routes, and answer navigation questions. Note: this is a prototype assistant — I can search the campus directory but I don't have live AI capabilities. Try one of the suggested prompts below!",
    },
  ]);
  const [input, setInput] = useState("");
  const voice = useVoiceRecognition((text) => {
    setInput(text);
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = useCallback((query: string): string => {
    const lower = query.toLowerCase();

    // Check for place queries
    if (lower.includes("library")) {
      const lib = PLACES.find((p) => p.id === "library");
      if (lib) return `The ${lib.name} is located ${lib.address}. It's open ${lib.hours}. ${lib.description} You can get directions by going to the Route Planner page.`;
    }
    if (lower.includes("cafeteria") || lower.includes("food") || lower.includes("eat")) {
      const caf = PLACES.filter((p) => p.category === "Cafeteria");
      return `There are ${caf.length} cafeterias on campus:\n${caf.map((c) => `• ${c.name} — ${c.hours}`).join("\n")}\n\nUse the Route Planner to get directions to any of them.`;
    }
    if (lower.includes("health") || lower.includes("clinic") || lower.includes("medical") || lower.includes("hospital")) {
      const h = PLACES.find((p) => p.id === "health-center");
      if (h) return `The ${h.name} is at ${h.address}. ${h.hours}. ${h.description} For emergencies, call ${h.phone}.`;
    }
    if (lower.includes("sport")) {
      const s = PLACES.find((p) => p.id === "sports-complex");
      if (s) return `The ${s.name} is at ${s.address}. Hours: ${s.hours}. ${s.description}`;
    }
    if (lower.includes("park")) {
      const p = PLACES.find((p) => p.id === "parking-main");
      if (p) return `The ${p.name} is at ${p.address}. ${p.description} It's open ${p.hours}.`;
    }
    if (lower.includes("mosque") || lower.includes("prayer") || lower.includes("muslim")) {
      const m = PLACES.find((p) => p.id === "mosque");
      if (m) return `The ${m.name} is at ${m.address}. ${m.description} Hours: ${m.hours}.`;
    }
    if (lower.includes("chapel") || lower.includes("church") || lower.includes("christian")) {
      const c = PLACES.find((p) => p.id === "chapel");
      if (c) return `The ${c.name} is at ${c.address}. ${c.description} Hours: ${c.hours}.`;
    }
    if (lower.includes("hostel") || lower.includes("accommodation") || lower.includes("dorm")) {
      const h = PLACES.filter((p) => p.category === "Hostel");
      return `There are ${h.length} hostels on campus:\n${h.map((x) => `• ${x.name} — ${x.address}`).join("\n")}`;
    }
    if (lower.includes("admin") || lower.includes("rector") || lower.includes("admission") || lower.includes("bursary")) {
      const a = PLACES.find((p) => p.id === "admin-block");
      if (a) return `The ${a.name} is at ${a.address}. Hours: ${a.hours}. ${a.description}`;
    }
    if (lower.includes("voice")) {
      return "You can use voice in two ways:\n1. On the Route Planner page, tap the microphone icon next to the destination field to search by voice.\n2. On the Directions page, tap the speaker icon to hear step-by-step spoken directions. You can also use voice to search for a destination.";
    }
    if (lower.includes("location") || lower.includes("gps") || lower.includes("where am i")) {
      return "To use your real-time location, go to the Route Planner or Directions page and tap 'Use My Location'. Your browser will ask for permission — allow it, and your position will appear on the map with a pulsing blue dot. Routes will then be calculated from where you actually are.";
    }
    if (lower.includes("direction") || lower.includes("route") || lower.includes("navigate") || lower.includes("how do i get")) {
      return "To get directions:\n1. Go to the Route Planner page\n2. Select your starting point (or use 'Use My Location')\n3. Choose your destination\n4. Tap 'Get Directions'\n5. Tap 'Start Walking Directions' for step-by-step guidance with voice support";
    }

    // Generic search
    const matched = PLACES.filter(
      (p) => p.name.toLowerCase().includes(lower) || p.tags.some((t) => lower.includes(t.toLowerCase())),
    );
    if (matched.length > 0) {
      return `I found ${matched.length} place(s) matching your query:\n${matched.map((p) => `• ${p.name} — ${p.category} (${p.hours.split(",")[0]})`).join("\n")}\n\nTap any place name in the Explore page for details and routing.`;
    }

    return "I can help you find places, understand routes, and answer questions about campus navigation. Try asking about specific buildings like 'Where is the library?' or 'How do I get to the cafeteria?' You can also ask about voice directions or using your location.";
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate thinking then respond
    setTimeout(() => {
      const response = generateResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    }, 400);
  }, [generateResponse]);

  return (
    <div className="page page--guide">
      <div className="page__header">
        <h1 className="page__title">AI Campus Guide</h1>
        <p className="page__desc">Ask about campus places, routes, and navigation. Voice input supported.</p>
      </div>

      <div className="guide-scope">
        <Info size={16} />
        <span>Prototype scope: This guide searches the campus directory. It does not use a live AI model — responses come from the local campus database.</span>
      </div>

      <div className="guide-chat" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`guide-message guide-message--${msg.role}`}>
            <div className="guide-message__avatar">
              {msg.role === "assistant" ? <Bot size={20} /> : <span>You</span>}
            </div>
            <div className="guide-message__bubble">
              {msg.text.split("\n").map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="guide-suggestions">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            className="guide-suggestion"
            onClick={() => sendMessage(prompt)}
            type="button"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="guide-input">
        <button
          className={`guide-input__mic ${voice.listening ? "guide-input__mic--active" : ""}`}
          onClick={() => (voice.listening ? voice.stop() : voice.start())}
          type="button"
          disabled={!voice.supported}
          aria-label="Voice input"
        >
          {voice.listening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <input
          type="text"
          placeholder="Ask about campus places, routes…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }}
          className="guide-input__field"
          aria-label="Ask a question"
        />
        <button className="guide-input__send" onClick={() => sendMessage(input)} disabled={!input.trim()} type="button" aria-label="Send message">
          <Send size={20} />
        </button>
      </div>
      {voice.listening && (
        <div className="geo-status geo-status--info">
          <Mic size={14} />
          <span>Listening… speak your question</span>
        </div>
      )}
      {voice.error && (
        <div className="geo-status geo-status--error">
          <AlertTriangle size={14} />
          <span>{voice.error}</span>
        </div>
      )}
    </div>
  );
}

// ─── Resources Page ──────────────────────────────────────────
function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="page page--resources">
      <div className="page__header">
        <h1 className="page__title">Resources</h1>
        <p className="page__desc">Campus directory, visitor guide, accessibility, FAQs, and emergency contacts.</p>
      </div>

      {/* Emergency */}
      <section className="resource-section resource-section--emergency">
        <div className="resource-section__header">
          <AlertTriangle size={22} className="resource-section__icon resource-section__icon--alert" />
          <h2>{RESOURCES.emergency.title}</h2>
        </div>
        <div className="emergency-grid">
          {RESOURCES.emergency.items.map((item) => (
            <a key={item.label} href={`tel:${item.value.replace(/\s/g, "")}`} className="emergency-card">
              <span className="emergency-card__label">{item.label}</span>
              <span className="emergency-card__value">{item.value}</span>
              <Phone size={16} />
            </a>
          ))}
        </div>
      </section>

      {/* Visitor Guide */}
      <section className="resource-section">
        <div className="resource-section__header">
          <Compass size={22} className="resource-section__icon" />
          <h2>{RESOURCES.visitor.title}</h2>
        </div>
        <div className="visitor-list">
          {RESOURCES.visitor.items.map((item, i) => (
            <div key={i} className="visitor-list__item">
              <span className="visitor-list__num">{i + 1}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Campus Directory */}
      <section className="resource-section">
        <div className="resource-section__header">
          <Building2 size={22} className="resource-section__icon" />
          <h2>Campus Directory</h2>
        </div>
        <div className="directory-list">
          {PLACES.map((place) => (
            <button
              key={place.id}
              className="directory-item"
              onClick={() => navigateToPlace(place.id)}
              type="button"
            >
              <CategoryIcon category={place.category} size={18} />
              <div className="directory-item__info">
                <span className="directory-item__name">{place.name}</span>
                <span className="directory-item__cat">{place.category}</span>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </section>

      {/* Map Legend */}
      <section className="resource-section">
        <div className="resource-section__header">
          <Layers size={22} className="resource-section__icon" />
          <h2>Map Legend</h2>
        </div>
        <div className="legend-grid">
          <div className="legend-item">
            <span className="legend-item__dot legend-item__dot--place" />
            <div>
              <span className="legend-item__label">Blue Pin</span>
              <span className="legend-item__desc">Campus place or building</span>
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-item__dot legend-item__dot--selected" />
            <div>
              <span className="legend-item__label">Orange Pin</span>
              <span className="legend-item__desc">Selected destination</span>
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-item__dot legend-item__dot--user" />
            <div>
              <span className="legend-item__label">Pulsing Dot</span>
              <span className="legend-item__desc">Your live location</span>
            </div>
          </div>
          <div className="legend-item">
            <span className="legend-item__line" />
            <div>
              <span className="legend-item__label">Dashed Line</span>
              <span className="legend-item__desc">Walking route</span>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="resource-section">
        <div className="resource-section__header">
          <Accessibility size={22} className="resource-section__icon" />
          <h2>Accessibility Information</h2>
        </div>
        <div className="accessibility-info">
          <p>All campus buildings have ramp access and accessible entrances. The library, administrative block, and auditorium have elevators to upper floors.</p>
          <p>Accessible parking spaces are available at the Main Parking Lot near all building entrances. The Health Center provides priority service for students with disabilities.</p>
          <p>The app supports voice input for searching and voice output for directions. Use the microphone and speaker icons on the Navigate and Directions pages.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="resource-section">
        <div className="resource-section__header">
          <Info size={22} className="resource-section__icon" />
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}>
              <button
                className="faq-item__question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                type="button"
                aria-expanded={openFaq === i}
              >
                <span>{faq.question}</span>
                <ChevronRight size={18} className={`faq-item__chevron ${openFaq === i ? "faq-item__chevron--open" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="faq-item__answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
