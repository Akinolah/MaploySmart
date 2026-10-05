export type PlaceCategory =
  | "Academic"
  | "Administrative"
  | "Library"
  | "Cafeteria"
  | "Hostel"
  | "Sports"
  | "Worship"
  | "Health"
  | "Landmark"
  | "Parking"
  | "Banking"
  | "Recreation";

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  description: string;
  address: string;
  hours: string;
  phone?: string;
  image: string;
  accessibility: string;
  tags: string[];
}

export interface RouteStep {
  id: number;
  instruction: string;
  distance: string;
  lat: number;
  lng: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  Academic: "Academic Buildings",
  Administrative: "Administrative Offices",
  Library: "Library & Study",
  Cafeteria: "Cafeteria & Food",
  Hostel: "Student Hostels",
  Sports: "Sports & Fitness",
  Worship: "Religious Centers",
  Health: "Health & Wellness",
  Landmark: "Campus Landmarks",
  Parking: "Parking Areas",
  Banking: "Banking & ATM",
  Recreation: "Recreation & Social",
};

export const CATEGORY_ICONS: Record<PlaceCategory, string> = {
  Academic: "GraduationCap",
  Administrative: "Building2",
  Library: "BookOpen",
  Cafeteria: "Utensils",
  Hostel: "BedDouble",
  Sports: "Dumbbell",
  Worship: "Church",
  Health: "HeartPulse",
  Landmark: "MapPin",
  Parking: "CircleParking",
  Banking: "Landmark",
  Recreation: "PartyPopper",
};

export const CATEGORIES: PlaceCategory[] = [
  "Academic",
  "Administrative",
  "Library",
  "Cafeteria",
  "Hostel",
  "Sports",
  "Worship",
  "Health",
  "Landmark",
  "Parking",
  "Banking",
  "Recreation",
];

export const MAP_CENTER: [number, number] = [7.1557, 3.3437];
export const MAP_ZOOM = 16;

export const PLACES: Place[] = [
  {
    id: "admin-block",
    name: "Administrative Block",
    category: "Administrative",
    lat: 7.1558,
    lng: 3.3435,
    description: "The central administrative building housing the Rector's office, registry, admissions, and bursary. All official administrative processes are handled here.",
    address: "Main Campus, Adjacent to the Main Gate",
    hours: "Mon–Fri: 8:00 AM – 4:00 PM",
    phone: "+234 803 000 0001",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground floor ramp access, elevator to upper floors, accessible restroom on ground floor.",
    tags: ["Rector's Office", "Admissions", "Bursary", "Registry"],
  },
  {
    id: "science-complex",
    name: "Science Complex",
    category: "Academic",
    lat: 7.1561,
    lng: 3.3442,
    description: "Science laboratories and lecture halls for science and engineering technology departments. Houses physics, chemistry, and biology labs.",
    address: "North Wing, Main Campus",
    hours: "Mon–Fri: 7:30 AM – 6:00 PM",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp at main entrance, elevator available, designated accessible seating in lecture halls.",
    tags: ["Laboratories", "Lecture Halls", "Science", "Engineering"],
  },
  {
    id: "ict-center",
    name: "ICT Center",
    category: "Academic",
    lat: 7.1565,
    lng: 3.3440,
    description: "Information and Communication Technology center with computer labs, servers, and tech support. Open to all students for research and coursework.",
    address: "East Wing, Main Campus",
    hours: "Mon–Sat: 8:00 AM – 8:00 PM",
    phone: "+234 803 000 0002",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963cef?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp access, adjustable workstation desks, screen reader software available.",
    tags: ["Computers", "Internet", "Printing", "Tech Support"],
  },
  {
    id: "library",
    name: "Polytechnic Library",
    category: "Library",
    lat: 7.1555,
    lng: 3.3445,
    description: "Main campus library with extensive collections, study areas, digital resources, and quiet reading rooms. Over 50,000 volumes available.",
    address: "Central Campus, Behind Administrative Block",
    hours: "Mon–Fri: 7:00 AM – 9:00 PM, Sat: 9:00 AM – 4:00 PM",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp entrance, elevator to all floors, accessible study carrels, large-print materials available.",
    tags: ["Study Areas", "Digital Resources", "Reading Room", "E-Library"],
  },
  {
    id: "student-center",
    name: "Student Union Building",
    category: "Recreation",
    lat: 7.1553,
    lng: 3.3438,
    description: "Student union headquarters with meeting rooms, student organization offices, and social spaces. Hub for student activities and events.",
    address: "Central Campus",
    hours: "Mon–Fri: 8:00 AM – 6:00 PM",
    image: "https://images.unsplash.com/photo-1523580494893-925929854de2?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground-level entrance, accessible restrooms, elevator available.",
    tags: ["Student Union", "Events", "Clubs", "Meetings"],
  },
  {
    id: "cafeteria-main",
    name: "Main Cafeteria",
    category: "Cafeteria",
    lat: 7.1560,
    lng: 3.3435,
    description: "The largest campus eatery serving local Nigerian dishes, snacks, and beverages. Affordable meals for students and staff.",
    address: "Central Campus, Near Science Complex",
    hours: "Mon–Sat: 7:00 AM – 7:00 PM",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground-level access, wide aisles, accessible seating areas.",
    tags: ["Local Food", "Snacks", "Drinks", "Affordable"],
  },
  {
    id: "cafeteria-2",
    name: "Mini Cafeteria",
    category: "Cafeteria",
    lat: 7.1550,
    lng: 3.3442,
    description: "Smaller eatery near the hostels, perfect for quick bites and breakfast. Serves fast food and refreshing drinks.",
    address: "South Campus, Near Hostels",
    hours: "Mon–Sat: 6:30 AM – 9:00 PM",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground-level access, outdoor seating available.",
    tags: ["Fast Food", "Quick Bites", "Drinks"],
  },
  {
    id: "hostel-male-a",
    name: "Hostel Block A (Male)",
    category: "Hostel",
    lat: 7.1548,
    lng: 3.3448,
    description: "Male student hostel with shared rooms, common rooms, and laundry facilities. Houses up to 400 students.",
    address: "South Campus",
    hours: "Open 24/7 for residents",
    image: "https://images.unsplash.com/photo-1555854877-bab0e9702af7?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground-floor accessible rooms available, ramp entrance.",
    tags: ["Male Hostel", "Residential", "Shared Rooms"],
  },
  {
    id: "hostel-female-b",
    name: "Hostel Block B (Female)",
    category: "Hostel",
    lat: 7.1546,
    lng: 3.3444,
    description: "Female student hostel with shared rooms, common areas, and 24/7 security. Houses up to 400 students.",
    address: "South Campus",
    hours: "Open 24/7 for residents",
    image: "https://images.unsplash.com/photo-1554999901-2630e99c27d5?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground-floor accessible rooms available, ramp entrance.",
    tags: ["Female Hostel", "Residential", "Shared Rooms"],
  },
  {
    id: "sports-complex",
    name: "Sports Complex",
    category: "Sports",
    lat: 7.1570,
    lng: 3.3450,
    description: "Multi-sport complex with football pitch, basketball court, tennis courts, and athletics track. Open for training and inter-departmental competitions.",
    address: "East Campus",
    hours: "Mon–Sat: 6:00 AM – 8:00 PM",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    accessibility: "Flat terrain access, accessible viewing areas, accessible changing rooms.",
    tags: ["Football", "Basketball", "Tennis", "Athletics"],
  },
  {
    id: "mosque",
    name: "Campus Mosque",
    category: "Worship",
    lat: 7.1552,
    lng: 3.3452,
    description: "Central campus mosque for Muslim students and staff. Daily prayers, Jumu'ah services, and Islamic society meetings.",
    address: "Central Campus",
    hours: "Open daily for all prayers",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground-level access, wide entrance, accessible ablution area.",
    tags: ["Muslim", "Prayer", "Jumu'ah", "Islamic Society"],
  },
  {
    id: "chapel",
    name: "Campus Chapel",
    category: "Worship",
    lat: 7.1549,
    lng: 3.3455,
    description: "Christian fellowship center for Sunday services, mid-week meetings, and campus Christian union activities.",
    address: "South Campus",
    hours: "Sun: 8:00 AM & 10:00 AM, Wed: 5:00 PM",
    image: "https://images.unsplash.com/photo-1605130284535-11dd9eed4f84?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground-level access, ramp at side entrance, accessible seating.",
    tags: ["Christian", "Fellowship", "Sunday Service"],
  },
  {
    id: "health-center",
    name: "Health Center",
    category: "Health",
    lat: 7.1556,
    lng: 3.3448,
    description: "Campus medical clinic providing primary healthcare, emergency first aid, vaccinations, and counseling services for students and staff.",
    address: "Central Campus, Near Library",
    hours: "24/7 Emergency, Mon–Fri: 8:00 AM – 6:00 PM",
    phone: "+234 803 000 0003",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
    accessibility: "Full wheelchair accessibility, accessible examination rooms, priority service for students with disabilities.",
    tags: ["Medical", "Emergency", "Counseling", "First Aid"],
  },
  {
    id: "main-gate",
    name: "Main Gate",
    category: "Landmark",
    lat: 7.1550,
    lng: 3.3430,
    description: "Primary entrance to the campus. Security checkpoint, visitor registration, and taxi/parking drop-off point.",
    address: "Oke-Mapon, Abeokuta",
    hours: "Open 24/7",
    image: "https://images.unsplash.com/photo-1564910325776-74e5f6f5a8ac?auto=format&fit=crop&w=800&q=80",
    accessibility: "Level access, security assistance available.",
    tags: ["Entrance", "Security", "Visitor Registration", "Transport"],
  },
  {
    id: "auditorium",
    name: "Auditorium",
    category: "Landmark",
    lat: 7.1559,
    lng: 3.3440,
    description: "Large-capacity auditorium for general assemblies, convocation ceremonies, lectures, and special events. Seats up to 1,500.",
    address: "Central Campus",
    hours: "As scheduled for events",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp access, designated wheelchair seating areas, hearing assist system available.",
    tags: ["Events", "Convocation", "Assembly", "Lectures"],
  },
  {
    id: "engineering-block",
    name: "Engineering Block",
    category: "Academic",
    lat: 7.1568,
    lng: 3.3445,
    description: "Engineering workshops and classrooms for mechanical, electrical, and civil engineering technology programs. Hands-on workshop spaces.",
    address: "East Campus, Near Sports Complex",
    hours: "Mon–Fri: 7:30 AM – 6:00 PM",
    image: "https://images.unsplash.com/photo-1581092160562-40aaea1f3496?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp access, wide workshop doors, accessible workstations.",
    tags: ["Engineering", "Workshops", "Mechanical", "Electrical"],
  },
  {
    id: "business-studies",
    name: "Business Studies Block",
    category: "Academic",
    lat: 7.1553,
    lng: 3.3433,
    description: "Lecture halls and offices for business administration, accountancy, and marketing departments. Modern classrooms with projectors.",
    address: "West Campus, Near Main Gate",
    hours: "Mon–Fri: 7:30 AM – 6:00 PM",
    image: "https://images.unsplash.com/photo-1554224155-6726b0ffce87?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp at main entrance, elevator, accessible seating in all halls.",
    tags: ["Business", "Accountancy", "Marketing", "Lecture Halls"],
  },
  {
    id: "parking-main",
    name: "Main Parking Lot",
    category: "Parking",
    lat: 7.1552,
    lng: 3.3432,
    description: "Primary parking area for students, staff, and visitors. Close to the main gate and administrative block. 24/7 security patrol.",
    address: "Near Main Gate",
    hours: "Open 24/7",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
    accessibility: "Designated accessible parking spaces near all building entrances.",
    tags: ["Parking", "Security", "Visitor Parking"],
  },
  {
    id: "bank-atm",
    name: "Banking Hall & ATM",
    category: "Banking",
    lat: 7.1557,
    lng: 3.3438,
    description: "On-campus banking services with ATMs, deposit facilities, and student account support. Multiple banks represented.",
    address: "Central Campus, Near Student Center",
    hours: "Mon–Fri: 9:00 AM – 4:00 PM, ATM 24/7",
    image: "https://images.unsplash.com/photo-1601597111158-2fcefffd8247?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ground-level access, wheelchair-height ATM, assisted service counter.",
    tags: ["ATM", "Banking", "Student Accounts", "Deposits"],
  },
  {
    id: "env-sciences",
    name: "Environmental Sciences Block",
    category: "Academic",
    lat: 7.1563,
    lng: 3.3431,
    description: "Classrooms and labs for architecture, surveying, and environmental studies. Design studios and model-making workshops.",
    address: "West Campus",
    hours: "Mon–Fri: 7:30 AM – 6:00 PM",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp access, wide studio doors, adjustable drafting tables.",
    tags: ["Architecture", "Surveying", "Environmental", "Design Studios"],
  },
  {
    id: "arts-center",
    name: "Arts & Culture Center",
    category: "Recreation",
    lat: 7.1547,
    lng: 3.3435,
    description: "Creative arts center for music, drama, fine arts, and cultural performances. Rehearsal rooms, gallery space, and performance hall.",
    address: "South Campus",
    hours: "Mon–Fri: 10:00 AM – 8:00 PM, Sat: 10:00 AM – 4:00 PM",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f8000?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp access, accessible performance seating, tactile art displays.",
    tags: ["Music", "Drama", "Fine Arts", "Cultural Events"],
  },
  {
    id: "polytechnic-square",
    name: "Polytechnic Square",
    category: "Landmark",
    lat: 7.1556,
    lng: 3.3442,
    description: "Central open courtyard and meeting point. Features the polytechnic monument, gardens, and seating areas. Hub of campus social life.",
    address: "Central Campus",
    hours: "Open 24/7",
    image: "https://images.unsplash.com/photo-1519672936437-e2543a4b6a7f?auto=format&fit=crop&w=800&q=80",
    accessibility: "Fully paved, level surface, accessible seating throughout.",
    tags: ["Meeting Point", "Gardens", "Monument", "Social Hub"],
  },
  {
    id: "communication-arts",
    name: "Communication & Media Block",
    category: "Academic",
    lat: 7.1572,
    lng: 3.3438,
    description: "Mass communication and media studies department with radio studio, editing suites, and print production facilities.",
    address: "East Campus",
    hours: "Mon–Fri: 7:30 AM – 6:00 PM",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp access, elevator, accessible studio entry.",
    tags: ["Mass Communication", "Radio Studio", "Media", "Print Production"],
  },
  {
    id: "pure-sciences",
    name: "Pure & Applied Sciences Block",
    category: "Academic",
    lat: 7.1545,
    lng: 3.3448,
    description: "Mathematics, statistics, and computer science departments. Smart classrooms and research labs.",
    address: "South Campus",
    hours: "Mon–Fri: 7:30 AM – 6:00 PM",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    accessibility: "Ramp access, elevator, accessible lab benches.",
    tags: ["Mathematics", "Statistics", "Computer Science", "Research"],
  },
];

export const GALLERY: GalleryItem[] = [
  {
    id: "g1",
    title: "Administrative Block",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
    caption: "The central administrative building at the heart of campus.",
  },
  {
    id: "g2",
    title: "Science Laboratories",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    caption: "Modern science labs equipped for research and learning.",
  },
  {
    id: "g3",
    title: "Campus Library",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    caption: "Over 50,000 volumes in a quiet, modern study environment.",
  },
  {
    id: "g4",
    title: "Sports Complex",
    category: "Recreation",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
    caption: "Football, basketball, tennis, and athletics facilities.",
  },
  {
    id: "g5",
    title: "Campus Mosque",
    category: "Worship",
    image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80",
    caption: "A peaceful place of worship for Muslim students and staff.",
  },
  {
    id: "g6",
    title: "Main Cafeteria",
    category: "Campus Life",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    caption: "Affordable local meals served daily.",
  },
  {
    id: "g7",
    title: "Auditorium",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    caption: "1,500-seat auditorium for events and convocation.",
  },
  {
    id: "g8",
    title: "Polytechnic Square",
    category: "Campus Life",
    image: "https://images.unsplash.com/photo-1519672936437-e2543a4b6a7f?auto=format&fit=crop&w=1200&q=80",
    caption: "The central meeting point and social hub of campus.",
  },
  {
    id: "g9",
    title: "Student Hostels",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1555854877-bab0e9702af7?auto=format&fit=crop&w=1200&q=80",
    caption: "On-campus accommodation for students.",
  },
  {
    id: "g10",
    title: "Engineering Workshops",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1581092160562-40aaea1f3496?auto=format&fit=crop&w=1200&q=80",
    caption: "Hands-on engineering technology workshops.",
  },
  {
    id: "g11",
    title: "Arts & Culture Center",
    category: "Recreation",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f8000?auto=format&fit=crop&w=1200&q=80",
    caption: "Creative arts and cultural performances.",
  },
  {
    id: "g12",
    title: "ICT Center",
    category: "Academic",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963cef?auto=format&fit=crop&w=1200&q=80",
    caption: "Modern computing facilities for all students.",
  },
];

export const GALLERY_CATEGORIES = ["All", "Architecture", "Academic", "Recreation", "Worship", "Campus Life", "Residential"];

export const FAQS: FAQ[] = [
  {
    question: "How do I get directions to a building on campus?",
    answer: "Go to the Navigate page, select your starting point (or use 'Your Location' to use your current GPS position), choose your destination from the list or map, and tap 'Get Directions'. You'll see the route on the map with distance, time, and step-by-step walking instructions.",
  },
  {
    question: "Can I use voice to search for places or get directions?",
    answer: "Yes! On the Navigate page, tap the microphone icon to speak your destination by voice. You can also tap the speaker icon on the Directions page to hear turn-by-turn instructions spoken aloud.",
  },
  {
    question: "Does the app use my real-time location?",
    answer: "Yes. When you tap 'Use My Location', the app will ask for your browser's location permission. If granted, it shows your real position on the map and calculates routes from where you actually are. If you deny permission, you can manually select a starting point instead.",
  },
  {
    question: "Is the map a real Google Map?",
    answer: "Yes, the app uses real interactive map tiles with accurate campus coordinates. You can zoom, pan, and see real streets and terrain around Moshood Abiola Polytechnic, Abeokuta.",
  },
  {
    question: "How accurate are the walking times?",
    answer: "Walking times are estimated based on the straight-line distance between points and an average walking speed of about 5 km/h. Actual times may vary based on your pace, path availability, and campus terrain.",
  },
  {
    question: "Can I use the app offline?",
    answer: "The app requires an internet connection to load map tiles and work properly. However, the campus directory and place information are stored locally so you can still browse places without a connection.",
  },
  {
    question: "Are the campus locations up to date?",
    answer: "The locations are based on the known campus layout of Moshood Abiola Polytechnic, Abeokuta. If you find an error or a missing building, please contact us through the Resources page.",
  },
  {
    question: "Does the app work on my phone?",
    answer: "Yes! MAPoly Smart Routing is fully responsive and works on mobile phones, tablets, and desktop computers. On mobile, navigation is at the bottom of the screen for easy one-handed use.",
  },
];

export const POPULAR_DESTINATIONS = [
  "admin-block",
  "library",
  "cafeteria-main",
  "ict-center",
  "health-center",
  "auditorium",
  "main-gate",
  "sports-complex",
];

export const RESOURCES = {
  emergency: {
    title: "Emergency Contacts",
    items: [
      { label: "Campus Security", value: "+234 803 000 0000" },
      { label: "Health Center (24/7)", value: "+234 803 000 0003" },
      { label: "National Emergency", value: "112" },
      { label: "Police", value: "199" },
      { label: "Fire Service", value: "119" },
    ],
  },
  visitor: {
    title: "First-Time Visitor Guide",
    items: [
      "Enter through the Main Gate and register at the security checkpoint.",
      "Visit the Administrative Block for official business and inquiries.",
      "The Polytechnic Library is open to visitors during library hours.",
      "Parking is available at the Main Parking Lot near the gate.",
      "The Main Cafeteria serves affordable meals from 7 AM to 7 PM.",
      "Download the campus map from the Resources section for offline reference.",
    ],
  },
};

// Haversine distance in meters
export function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function walkingTimeMinutes(meters: number): number {
  return Math.max(1, Math.round((meters / 1000) / 5 * 60));
}

// Generate route steps between two points using simple interpolated path
export function generateRouteSteps(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  fromName: string,
  toName: string,
): RouteStep[] {
  const totalDist = distanceMeters(fromLat, fromLng, toLat, toLng);
  const steps: RouteStep[] = [];
  const numIntermediate = Math.max(2, Math.round(totalDist / 100));

  const directions: { heading: string; lat: number; lng: number }[] = [];

  for (let i = 0; i <= numIntermediate; i++) {
    const t = i / numIntermediate;
    const lat = fromLat + (toLat - fromLat) * t;
    const lng = fromLng + (toLng - fromLng) * t;
    let heading = "Continue straight";
    if (i > 0) {
      const prevLat = fromLat + (toLat - fromLat) * ((i - 1) / numIntermediate);
      const prevLng = fromLng + (toLng - fromLng) * ((i - 1) / numIntermediate);
      const dLat = lat - prevLat;
      const dLng = lng - prevLng;
      const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
      if (angle > -22.5 && angle <= 22.5) heading = "Head north";
      else if (angle > 22.5 && angle <= 67.5) heading = "Head northeast";
      else if (angle > 67.5 && angle <= 112.5) heading = "Head east";
      else if (angle > 112.5 && angle <= 157.5) heading = "Head southeast";
      else if (angle > 157.5 || angle <= -157.5) heading = "Head south";
      else if (angle > -157.5 && angle <= -112.5) heading = "Head southwest";
      else if (angle > -112.5 && angle <= -67.5) heading = "Head west";
      else if (angle > -67.5 && angle <= -22.5) heading = "Head northwest";
    }
    directions.push({ heading, lat, lng });
  }

  steps.push({
    id: 0,
    instruction: `Start from ${fromName}`,
    distance: "0 m",
    lat: fromLat,
    lng: fromLng,
  });

  // Build human-readable turns
  const segmentDist = totalDist / numIntermediate;
  for (let i = 1; i < directions.length; i++) {
    const prevHeading = directions[i - 1].heading;
    const currHeading = directions[i].heading;
    let instruction = currHeading;

    if (i > 1 && prevHeading !== currHeading) {
      instruction = `Turn and ${currHeading.toLowerCase()}`;
    } else if (i === 1) {
      instruction = `${currHeading} from ${fromName}`;
    }

    if (i === directions.length - 1) {
      instruction = `Arrive at ${toName}`;
    }

    steps.push({
      id: i,
      instruction,
      distance: formatDistance(segmentDist),
      lat: directions[i].lat,
      lng: directions[i].lng,
    });
  }

  return steps;
}
