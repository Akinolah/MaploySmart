import { useEffect, useRef, useState, useCallback } from "react";
import * as L from "leaflet";
import { Place, MAP_CENTER, MAP_ZOOM } from "./data";
import { LocationState } from "./hooks";

// Fix default icon paths for Leaflet in bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

const blueIcon = L.divIcon({
  className: "maply-marker",
  html: `<div class="maply-marker-pin" style="background:#1565C0;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const orangeIcon = L.divIcon({
  className: "maply-marker",
  html: `<div class="maply-marker-pin maply-marker-pin--selected" style="background:#F57C00;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const userIcon = L.divIcon({
  className: "maply-user-marker",
  html: `<div class="maply-user-pulse"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const startIcon = L.divIcon({
  className: "maply-marker",
  html: `<div class="maply-marker-pin maply-marker-pin--start" style="background:#1565C0;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3" fill="white"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const endIcon = L.divIcon({
  className: "maply-marker",
  html: `<div class="maply-marker-pin maply-marker-pin--end" style="background:#F57C00;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export interface MapHandle {
  flyTo: (lat: number, lng: number, zoom?: number) => void;
  fitBounds: (bounds: [[number, number], [number, number]]) => void;
  invalidate: () => void;
  getMap: () => L.Map | null;
}

interface CampusMapProps {
  places: Place[];
  selectedPlaceId?: string | null;
  onSelectPlace?: (id: string) => void;
  userLocation?: LocationState | null;
  routeLine?: [number, number][] | null;
  routeStart?: { lat: number; lng: number; name: string } | null;
  routeEnd?: { lat: number; lng: number; name: string } | null;
  mapRef?: React.MutableRefObject<MapHandle | null>;
  className?: string;
}

export function CampusMap({
  places,
  selectedPlaceId,
  onSelectPlace,
  userLocation,
  routeLine,
  routeStart,
  routeEnd,
  mapRef,
  className,
}: CampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    // Use OpenStreetMap tiles (real map data)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    // Expose handle
    if (mapRef) {
      mapRef.current = {
        flyTo: (lat, lng, zoom) => {
          map.flyTo([lat, lng], zoom ?? map.getZoom(), { duration: 0.8 });
        },
        fitBounds: (bounds) => {
          map.flyToBounds(bounds, { padding: [60, 60], duration: 0.8 });
        },
        invalidate: () => {
          map.invalidateSize();
        },
        getMap: () => map,
      };
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
      userMarkerRef.current = null;
      userCircleRef.current = null;
      routeLayerRef.current = null;
      startMarkerRef.current = null;
      endMarkerRef.current = null;
    };
  }, []);

  // Update place markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    places.forEach((place) => {
      const isSelected = place.id === selectedPlaceId;
      const marker = L.marker([place.lat, place.lng], {
        icon: isSelected ? orangeIcon : blueIcon,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:'DM Sans',sans-serif;min-width:160px;">
          <strong style="color:#1565C0;font-size:14px;">${place.name}</strong><br/>
          <span style="color:#666;font-size:12px;">${place.category}</span>
        </div>`,
      );

      marker.on("click", () => {
        onSelectPlace?.(place.id);
      });

      markersRef.current[place.id] = marker;
    });
  }, [places, selectedPlaceId, mapReady, onSelectPlace]);

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (userCircleRef.current) {
      userCircleRef.current.remove();
      userCircleRef.current = null;
    }

    if (userLocation) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      userCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: userLocation.accuracy,
        color: "#1565C0",
        fillColor: "#1565C0",
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(map);
    }
  }, [userLocation, mapReady]);

  // Update route line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.remove();
      endMarkerRef.current = null;
    }

    if (routeLine && routeLine.length > 1) {
      // Draw a dashed blue line for the route
      routeLayerRef.current = L.polyline(routeLine, {
        color: "#1565C0",
        weight: 5,
        opacity: 0.8,
        dashArray: "10, 8",
        lineCap: "round",
      }).addTo(map);
    }

    if (routeStart) {
      startMarkerRef.current = L.marker([routeStart.lat, routeStart.lng], { icon: startIcon }).addTo(map);
      startMarkerRef.current.bindPopup(
        `<div style="font-family:'DM Sans',sans-serif;"><strong style="color:#1565C0;">Start</strong><br/>${routeStart.name}</div>`,
      );
    }

    if (routeEnd) {
      endMarkerRef.current = L.marker([routeEnd.lat, routeEnd.lng], { icon: endIcon }).addTo(map);
      endMarkerRef.current.bindPopup(
        `<div style="font-family:'DM Sans',sans-serif;"><strong style="color:#F57C00;">Destination</strong><br/>${routeEnd.name}</div>`,
      );
    }
  }, [routeLine, routeStart, routeEnd, mapReady]);

  // Fly to selected place
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlaceId || !mapReady) return;
    const place = places.find((p) => p.id === selectedPlaceId);
    if (place) {
      map.flyTo([place.lat, place.lng], 18, { duration: 0.6 });
      const marker = markersRef.current[place.id];
      if (marker) {
        setTimeout(() => marker.openPopup(), 700);
      }
    }
  }, [selectedPlaceId, places, mapReady]);

  return <div ref={containerRef} className={className} role="application" aria-label="Interactive campus map" />;
}

// Helper to fit route bounds
export function fitRouteBounds(
  map: MapHandle | null,
  points: { lat: number; lng: number }[],
) {
  if (!map || points.length === 0) return;
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  map.fitBounds([
    [minLat, minLng],
    [maxLat, maxLng],
  ]);
}

export { L };
