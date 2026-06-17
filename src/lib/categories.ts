// SkillBuddy curated categories with Lucide icon names + hover animation key.
// `anim` keys are handled by <CategoryCard /> with Framer Motion variants.
export type AnimKind =
  | "sweep"   // cleaning broom side-to-side
  | "walk"    // paw prints
  | "drive"   // truck
  | "drop"    // water droplet
  | "stroke"  // paintbrush
  | "bounce"  // music note
  | "flash"   // lightning
  | "spin"
  | "scale";  // default

export type CategoryDef = {
  slug: string;
  name: string;
  icon: string; // lucide icon name (PascalCase)
  anim: AnimKind;
  description: string;
};

export const CATEGORIES_FULL: CategoryDef[] = [
  { slug: "cleaning", name: "Cleaning", icon: "Sparkles", anim: "sweep", description: "Home, office, and deep cleaning pros." },
  { slug: "repairing", name: "Repairing", icon: "Wrench", anim: "scale", description: "General repair & handyman services." },
  { slug: "plumbing", name: "Plumbing", icon: "Droplets", anim: "drop", description: "Leaks, installs, and emergency calls." },
  { slug: "shifting", name: "Shifting & Moving", icon: "Truck", anim: "drive", description: "Movers, packing, and relocation." },
  { slug: "painting", name: "Painting", icon: "Paintbrush", anim: "stroke", description: "Interior & exterior painting pros." },
  { slug: "laundry", name: "Laundry", icon: "WashingMachine", anim: "spin", description: "Pickup, wash, and delivery." },
  { slug: "ac-repair", name: "AC Repair", icon: "Wind", anim: "scale", description: "Cooling, heating, and HVAC service." },
  { slug: "car-repair", name: "Car Repair", icon: "Car", anim: "drive", description: "Mobile mechanics & roadside help." },
  { slug: "pet-care", name: "Pet Care", icon: "PawPrint", anim: "walk", description: "Sitters, walkers, and trainers." },
  { slug: "photography", name: "Photography", icon: "Camera", anim: "scale", description: "Event, portrait, and product shoots." },
  { slug: "graphic-design", name: "Graphic Design", icon: "Pen", anim: "stroke", description: "Logos, brand kits, and assets." },
  { slug: "interior-design", name: "Interior Design", icon: "Home", anim: "scale", description: "Room makeovers and full design plans." },
  { slug: "makeup", name: "Makeup Artist", icon: "Smile", anim: "scale", description: "Bridal, party, and editorial makeup." },
  { slug: "hair", name: "Hair Stylist", icon: "Scissors", anim: "scale", description: "Cuts, color, balayage, and styling." },
  { slug: "nails", name: "Nail Artist", icon: "Hand", anim: "scale", description: "Manicures, pedicures, and nail art." },
  { slug: "fitness", name: "Yoga & Fitness", icon: "Dumbbell", anim: "scale", description: "Personal coaches & yoga teachers." },
  { slug: "massage", name: "Massage", icon: "HandHelping", anim: "scale", description: "Deep tissue, Swedish, and prenatal." },
  { slug: "electrician", name: "Electrician", icon: "Zap", anim: "flash", description: "Wiring, fixtures, and smart home." },
  { slug: "locksmith", name: "Locksmith", icon: "Lock", anim: "scale", description: "Lockouts, rekeys, and smart locks." },
  { slug: "pool", name: "Pool Cleaner", icon: "Waves", anim: "drop", description: "Weekly maintenance and chemistry." },
  { slug: "tutor", name: "Home Tutor", icon: "BookOpen", anim: "scale", description: "Math, science, languages, test prep." },
  { slug: "music", name: "Music Teacher", icon: "Music", anim: "bounce", description: "Guitar, piano, voice, drums." },
  { slug: "dance", name: "Dance", icon: "Music2", anim: "bounce", description: "Salsa, hip-hop, ballet, contemporary." },
  { slug: "legal", name: "Legal Advisor", icon: "Scale", anim: "scale", description: "Contracts, business formation, advice." },
  { slug: "accountant", name: "Accountant", icon: "Calculator", anim: "scale", description: "Bookkeeping, taxes, and advisory." },
  { slug: "it-support", name: "IT Support", icon: "Monitor", anim: "flash", description: "Devices, network, and software help." },
  { slug: "tour-guide", name: "Tour Guide", icon: "Map", anim: "walk", description: "City walks, food, and culture tours." },
  { slug: "shoe-repair", name: "Shoe Repair", icon: "Footprints", anim: "walk", description: "Resoling, stitching, restoration." },
  { slug: "tailor", name: "Tailor", icon: "Shirt", anim: "scale", description: "Alterations, hemming, custom fit." },
  { slug: "phone-repair", name: "Phone Repair", icon: "Smartphone", anim: "scale", description: "Same-day screen and battery fixes." },
  { slug: "architect", name: "Architect", icon: "Building", anim: "scale", description: "Renovations, additions, custom homes." },
];
