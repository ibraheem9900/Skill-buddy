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
  nameKey: string;
  icon: string; // lucide icon name (PascalCase)
  anim: AnimKind;
  description: string;
};

export const CATEGORIES_FULL: CategoryDef[] = [
  { slug: "cleaning", name: "Cleaning", nameKey: "catfull.cleaning", icon: "Sparkles", anim: "sweep", description: "Home, office, and deep cleaning pros." },
  { slug: "repairing", name: "Repairing", nameKey: "catfull.repairing", icon: "Wrench", anim: "scale", description: "General repair & handyman services." },
  { slug: "plumbing", name: "Plumbing", nameKey: "catfull.plumbing", icon: "Droplets", anim: "drop", description: "Leaks, installs, and emergency calls." },
  { slug: "shifting", name: "Shifting & Moving", nameKey: "catfull.shifting", icon: "Truck", anim: "drive", description: "Movers, packing, and relocation." },
  { slug: "painting", name: "Painting", nameKey: "catfull.painting", icon: "Paintbrush", anim: "stroke", description: "Interior & exterior painting pros." },
  { slug: "laundry", name: "Laundry", nameKey: "catfull.laundry", icon: "WashingMachine", anim: "spin", description: "Pickup, wash, and delivery." },
  { slug: "ac-repair", name: "AC Repair", nameKey: "catfull.acRepair", icon: "Wind", anim: "scale", description: "Cooling, heating, and HVAC service." },
  { slug: "car-repair", name: "Car Repair", nameKey: "catfull.carRepair", icon: "Car", anim: "drive", description: "Mobile mechanics & roadside help." },
  { slug: "pet-care", name: "Pet Care", nameKey: "catfull.petCare", icon: "PawPrint", anim: "walk", description: "Sitters, walkers, and trainers." },
  { slug: "photography", name: "Photography", nameKey: "catfull.photography", icon: "Camera", anim: "scale", description: "Event, portrait, and product shoots." },
  { slug: "graphic-design", name: "Graphic Design", nameKey: "catfull.graphicDesign", icon: "Pen", anim: "stroke", description: "Logos, brand kits, and assets." },
  { slug: "interior-design", name: "Interior Design", nameKey: "catfull.interiorDesign", icon: "Home", anim: "scale", description: "Room makeovers and full design plans." },
  { slug: "makeup", name: "Makeup Artist", nameKey: "catfull.makeup", icon: "Smile", anim: "scale", description: "Bridal, party, and editorial makeup." },
  { slug: "hair", name: "Hair Stylist", nameKey: "catfull.hair", icon: "Scissors", anim: "scale", description: "Cuts, color, balayage, and styling." },
  { slug: "nails", name: "Nail Artist", nameKey: "catfull.nails", icon: "Hand", anim: "scale", description: "Manicures, pedicures, and nail art." },
  { slug: "fitness", name: "Yoga & Fitness", nameKey: "catfull.fitness", icon: "Dumbbell", anim: "scale", description: "Personal coaches & yoga teachers." },
  { slug: "massage", name: "Massage", nameKey: "catfull.massage", icon: "HandHelping", anim: "scale", description: "Deep tissue, Swedish, and prenatal." },
  { slug: "electrician", name: "Electrician", nameKey: "catfull.electrician", icon: "Zap", anim: "flash", description: "Wiring, fixtures, and smart home." },
  { slug: "locksmith", name: "Locksmith", nameKey: "catfull.locksmith", icon: "Lock", anim: "scale", description: "Lockouts, rekeys, and smart locks." },
  { slug: "pool", name: "Pool Cleaner", nameKey: "catfull.pool", icon: "Waves", anim: "drop", description: "Weekly maintenance and chemistry." },
  { slug: "tutor", name: "Home Tutor", nameKey: "catfull.tutor", icon: "BookOpen", anim: "scale", description: "Math, science, languages, test prep." },
  { slug: "music", name: "Music Teacher", nameKey: "catfull.music", icon: "Music", anim: "bounce", description: "Guitar, piano, voice, drums." },
  { slug: "dance", name: "Dance", nameKey: "catfull.dance", icon: "Music2", anim: "bounce", description: "Salsa, hip-hop, ballet, contemporary." },
  { slug: "legal", name: "Legal Advisor", nameKey: "catfull.legal", icon: "Scale", anim: "scale", description: "Contracts, business formation, advice." },
  { slug: "accountant", name: "Accountant", nameKey: "catfull.accountant", icon: "Calculator", anim: "scale", description: "Bookkeeping, taxes, and advisory." },
  { slug: "it-support", name: "IT Support", nameKey: "catfull.itSupport", icon: "Monitor", anim: "flash", description: "Devices, network, and software help." },
  { slug: "tour-guide", name: "Tour Guide", nameKey: "catfull.tourGuide", icon: "Map", anim: "walk", description: "City walks, food, and culture tours." },
  { slug: "shoe-repair", name: "Shoe Repair", nameKey: "catfull.shoeRepair", icon: "Footprints", anim: "walk", description: "Resoling, stitching, restoration." },
  { slug: "tailor", name: "Tailor", nameKey: "catfull.tailor", icon: "Shirt", anim: "scale", description: "Alterations, hemming, custom fit." },
  { slug: "phone-repair", name: "Phone Repair", nameKey: "catfull.phoneRepair", icon: "Smartphone", anim: "scale", description: "Same-day screen and battery fixes." },
  { slug: "architect", name: "Architect", nameKey: "catfull.architect", icon: "Building", anim: "scale", description: "Renovations, additions, custom homes." },
];
