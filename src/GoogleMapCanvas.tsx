import { useEffect, useRef, useState } from 'react'
import type { Place } from './data'

export type LatLng = { lat: number; lng: number }

type Props = {
  places: Place[]
  center?: LatLng
  selectedId?: string
  origin?: LatLng | null
  routeFrom?: LatLng | null
  routeTo?: LatLng | null
  onSelect?: (id: string) => void
  followLocation?: boolean
  className?: string
}

type GoogleMaps = typeof google.maps

let mapsPromise: Promise<GoogleMaps> | null = null

function loadGoogleMaps() {
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  if (mapsPromise) return mapsPromise
  const base = import.meta.env.VITE_MANUS_API_URL
  const key = import.meta.env.VITE_MANUS_API_BROWSER_KEY
  if (!base || !key) return Promise.reject(new Error('Google Maps credentials are not available in this preview.'))
  mapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-mapoly-google-maps]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps))
      existing.addEventListener('error', () => reject(new Error('Google Maps failed to load.')))
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.dataset.mapolyGoogleMaps = 'true'
    script.src = `${base}/v1/maps/proxy/maps/api/js?key=${encodeURIComponent(key)}&libraries=geometry`
    script.onload = () => window.google?.maps ? resolve(window.google.maps) : reject(new Error('Google Maps is unavailable.'))
    script.onerror = () => reject(new Error('Google Maps failed to load.'))
    document.head.appendChild(script)
  })
  return mapsPromise
}

export function GoogleMapCanvas({ places, center = { lat: 7.1010567, lng: 3.3296175 }, selectedId, origin, routeFrom, routeTo, onSelect, followLocation = false, className = '' }: Props) {
  const elementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const rendererRef = useRef<google.maps.DirectionsRenderer | null>(null)
  const userMarkerRef = useRef<google.maps.Marker | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [message, setMessage] = useState('Loading Google Maps…')

  useEffect(() => {
    let alive = true
    loadGoogleMaps().then((maps) => {
      if (!alive || !elementRef.current) return
      const map = new maps.Map(elementRef.current, { center, zoom: 17, mapTypeControl: true, streetViewControl: false, fullscreenControl: true, gestureHandling: 'greedy', clickableIcons: true })
      mapRef.current = map
      setStatus('ready')
      setMessage('')
    }).catch((error) => { if (alive) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Google Maps could not load.') } })
    return () => { alive = false; markersRef.current.forEach((marker) => marker.setMap(null)); rendererRef.current?.setMap(null); userMarkerRef.current?.setMap(null); mapRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps) return
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = places.map((place) => {
      const marker = new google.maps.Marker({ map, position: place.location, title: place.name, label: { text: place.shortName, color: '#132a46', fontSize: '11px', fontWeight: '700' }, icon: { path: google.maps.SymbolPath.CIRCLE, scale: selectedId === place.id ? 9 : 7, fillColor: place.accent, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 } })
      marker.addListener('click', () => onSelect?.(place.id))
      return marker
    })
    if (selectedId) {
      const selected = places.find((place) => place.id === selectedId)
      if (selected) map.panTo(selected.location)
    }
  }, [places, selectedId, onSelect])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps || !origin) return
    if (!userMarkerRef.current) userMarkerRef.current = new google.maps.Marker({ map, position: origin, title: 'Your live location', icon: { path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#ef7c32', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 } })
    else userMarkerRef.current.setPosition(origin)
    if (followLocation) map.panTo(origin)
  }, [origin, followLocation])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !window.google?.maps || !routeFrom || !routeTo) return
    const service = new google.maps.DirectionsService()
    if (!rendererRef.current) rendererRef.current = new google.maps.DirectionsRenderer({ map, suppressMarkers: true, polylineOptions: { strokeColor: '#1558a6', strokeWeight: 6, strokeOpacity: .92 } })
    service.route({ origin: routeFrom, destination: routeTo, travelMode: google.maps.TravelMode.WALKING }, (result, response) => {
      if (response === 'OK' && result) rendererRef.current?.setDirections(result)
      else setMessage('Walking route is unavailable for these points. Try another destination.')
    })
  }, [routeFrom, routeTo])

  return <div className={`google-map-wrap ${className}`}><div ref={elementRef} className="google-map" aria-label="Live Google map of MAPOLY campus" />{status !== 'ready' && <div className={`map-status ${status}`} role={status === 'error' ? 'alert' : 'status'}>{status === 'loading' ? <span className="map-spinner" /> : null}<span>{message}</span></div>}</div>
}
