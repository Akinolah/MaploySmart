export type Category = 'Academic' | 'Services' | 'Student life' | 'Landmark'

export type Place = {
  id: string
  name: string
  shortName: string
  category: Category
  description: string
  hours: string
  status: 'Open now' | 'Closes soon' | '24/7'
  accessibility: string
  tags: string[]
  distance: string
  accent: string
  position: { left: number; top: number }
  image: string
}

export const places: Place[] = [
  {
    id: 'library',
    name: 'Salawu Abiola Memorial Library',
    shortName: 'Memorial Library',
    category: 'Academic',
    description: 'A quiet study anchor with reading rooms, reference support, and open-air tables for focused work between classes.',
    hours: 'Mon–Fri · 8:00 AM – 8:00 PM',
    status: 'Open now',
    accessibility: 'Step-free entrance at the east side',
    tags: ['Study', 'Books', 'Wi-Fi'],
    distance: '320 m',
    accent: '#0b8f83',
    position: { left: 43, top: 37 },
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1100&q=80',
  },
  {
    id: 'health',
    name: 'Student Health Center',
    shortName: 'Health Center',
    category: 'Services',
    description: 'Your first stop for basic care, wellness support, and practical health guidance during the school day.',
    hours: 'Mon–Fri · 8:00 AM – 5:00 PM',
    status: 'Closes soon',
    accessibility: 'Ground-floor access and priority seating',
    tags: ['Care', 'Support', 'Urgent'],
    distance: '460 m',
    accent: '#ee8067',
    position: { left: 66, top: 20 },
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1100&q=80',
  },
  {
    id: 'science',
    name: 'Science Complex',
    shortName: 'Science Complex',
    category: 'Academic',
    description: 'Lecture rooms and practical labs for science students, tucked behind the central academic walk.',
    hours: 'Mon–Fri · 7:30 AM – 6:00 PM',
    status: 'Open now',
    accessibility: 'Accessible route from the main walk',
    tags: ['Labs', 'Classes', 'Academic'],
    distance: '540 m',
    accent: '#4863c9',
    position: { left: 49, top: 72 },
    image: 'https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?auto=format&fit=crop&w=1100&q=80',
  },
  {
    id: 'ogd',
    name: 'Otunba Gbenga Daniel Hall',
    shortName: 'OGD Hall',
    category: 'Student life',
    description: 'A busy student gathering point for events, societies, announcements, and campus energy.',
    hours: 'Mon–Sat · 8:00 AM – 9:00 PM',
    status: 'Open now',
    accessibility: 'Ramp access on the north side',
    tags: ['Events', 'Student life', 'Hall'],
    distance: '680 m',
    accent: '#d99335',
    position: { left: 18, top: 59 },
    image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1100&q=80',
  },
  {
    id: 'market',
    name: 'Mapoly Main Gate',
    shortName: 'Main Gate',
    category: 'Landmark',
    description: 'The easiest arrival point for first-time visitors, taxis, and a quick orientation before you head deeper into campus.',
    hours: 'Always open',
    status: '24/7',
    accessibility: 'Drop-off zone and wide pedestrian entry',
    tags: ['Arrival', 'Landmark', 'Taxi'],
    distance: '1.1 km',
    accent: '#825ac1',
    position: { left: 10, top: 78 },
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1100&q=80',
  },
  {
    id: 'engineering',
    name: 'Electrical Engineering Department',
    shortName: 'Electrical Engineering',
    category: 'Academic',
    description: 'Department offices, practical rooms, and teaching spaces for electrical and electronics engineering.',
    hours: 'Mon–Fri · 8:00 AM – 5:00 PM',
    status: 'Open now',
    accessibility: 'Ask at the front desk for step-free route',
    tags: ['Engineering', 'Labs', 'Classes'],
    distance: '740 m',
    accent: '#2f9a6d',
    position: { left: 31, top: 25 },
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1100&q=80',
  },
  {
    id: 'admin',
    name: 'Small Admin',
    shortName: 'Small Admin',
    category: 'Services',
    description: 'A convenient administrative stop for everyday student services and official campus questions.',
    hours: 'Mon–Fri · 8:00 AM – 4:00 PM',
    status: 'Open now',
    accessibility: 'Accessible front entrance',
    tags: ['Admin', 'Student services', 'Help'],
    distance: '390 m',
    accent: '#d3618a',
    position: { left: 57, top: 48 },
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=80',
  },
  {
    id: 'sports',
    name: 'Sports Complex',
    shortName: 'Sports Complex',
    category: 'Student life',
    description: 'Open space for games, team practice, recreation, and campus events under the afternoon sun.',
    hours: 'Mon–Sat · 7:00 AM – 7:00 PM',
    status: 'Open now',
    accessibility: 'Flat outdoor route from student walk',
    tags: ['Sport', 'Recreation', 'Outdoor'],
    distance: '860 m',
    accent: '#4e8dc4',
    position: { left: 79, top: 31 },
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1100&q=80',
  },
]

export const categories: Array<'All' | Category> = ['All', 'Academic', 'Services', 'Student life', 'Landmark']

export const popularPlaceIds = ['library', 'health', 'ogd', 'market']

export type RouteStep = { index: number; icon: string; title: string; detail: string; distance: string; tone: 'teal' | 'navy' | 'coral' }

export function getRouteSteps(fromId: string, toId: string): RouteStep[] {
  const from = getPlace(fromId)
  const to = getPlace(toId)
  return [
    { index: 1, icon: 'walk', title: `Leave ${from.shortName}`, detail: 'Follow the marked central academic walk.', distance: '180 m', tone: 'teal' },
    { index: 2, icon: 'turn', title: 'Keep the main walk on your right', detail: 'Pass the student noticeboard and stay on the covered path.', distance: '120 m', tone: 'navy' },
    { index: 3, icon: 'walk', title: `Continue toward ${to.shortName}`, detail: 'Follow the teal markers until the destination comes into view.', distance: '240 m', tone: 'teal' },
    { index: 4, icon: 'arrive', title: 'You have arrived', detail: `${to.name} is ahead on your left.`, distance: '—', tone: 'coral' },
  ]
}

export const galleryItems = [
  { id: 'campus-green', title: 'The campus green', category: 'Campus life', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', caption: 'A slower route between lectures.' },
  { id: 'study-court', title: 'Study court', category: 'Study spots', image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=1200&q=80', caption: 'Find a quiet corner near the library.' },
  { id: 'student-life', title: 'Student life', category: 'Campus life', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', caption: 'The people make the place.' },
  { id: 'architecture', title: 'Campus architecture', category: 'Landmarks', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80', caption: 'Notice the details along your route.' },
  { id: 'sports-day', title: 'Sports day', category: 'Campus life', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80', caption: 'Meet the campus outdoors.' },
  { id: 'learning', title: 'Learning in motion', category: 'Study spots', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80', caption: 'A new class, a new direction.' },
]

export const faqs = [
  { q: 'How accurate are the routes?', a: 'The prototype uses curated campus paths and estimated walking times. A live routing integration can replace these estimates in the production build.' },
  { q: 'Can I use MAPolyGo without location permission?', a: 'Yes. Pick a known campus place as your starting point, or use the Main Gate as a reliable fallback.' },
  { q: 'Where do I find accessibility notes?', a: 'Every place detail card includes an accessibility note, and the Resources page collects planning tips in one place.' },
]

export const getPlace = (id?: string) => places.find((place) => place.id === id) ?? places[0]
