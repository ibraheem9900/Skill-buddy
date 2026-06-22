// SkillBuddy services seed data — 55 services across 11 categories
export type Service = {
  id: string;
  titleKey: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  longDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  provider: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    location: string;
    bio: string;
  };
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
  description: string;
};

export const CATEGORIES: Category[] = [
  { slug: "creative-design", name: "Creative & Design", icon: "Palette", description: "Photographers, designers, and creative pros." },
  { slug: "pet-care", name: "Pet Care", icon: "PawPrint", description: "Sitters, trainers, and vets for your companions." },
  { slug: "beauty-personal", name: "Beauty & Personal Care", icon: "Sparkles", description: "Makeup, hair, nails, and barbering at home." },
  { slug: "health-wellness", name: "Health & Wellness", icon: "HeartPulse", description: "Coaches, therapists, and medical assistants." },
  { slug: "home-property", name: "Home & Property", icon: "Home", description: "Repairs, cleaning, and home upkeep." },
  { slug: "household-assistance", name: "Personal & Household", icon: "Users", description: "Caretakers, drivers, and household help." },
  { slug: "education-training", name: "Education & Training", icon: "GraduationCap", description: "Tutors, instructors, and lifelong learning." },
  { slug: "event-party", name: "Event & Party", icon: "PartyPopper", description: "Planners who make your events shine." },
  { slug: "business-pro", name: "Business & Professional", icon: "Briefcase", description: "Accountants, legal, IT, and marketing experts." },
  { slug: "travel-transport", name: "Travel & Transportation", icon: "Plane", description: "Drivers, towing, tour guides, and storage." },
  { slug: "repair-custom", name: "Repair & Customization", icon: "Wrench", description: "Tailors, technicians, and skilled repairs." },
];

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const providers = [
  { id: "p1", name: "Alex Morgan", avatar: "https://i.pravatar.cc/200?img=12", verified: true, location: "Brooklyn, NY", bio: "10+ years delivering 5-star service with care and precision." },
  { id: "p2", name: "Priya Kapoor", avatar: "https://i.pravatar.cc/200?img=47", verified: true, location: "Austin, TX", bio: "Detail-obsessed pro trusted by hundreds of happy clients." },
  { id: "p3", name: "Marcus Lee", avatar: "https://i.pravatar.cc/200?img=68", verified: true, location: "San Diego, CA", bio: "Certified specialist focused on quality, safety, and speed." },
  { id: "p4", name: "Sofia Romero", avatar: "https://i.pravatar.cc/200?img=32", verified: true, location: "Miami, FL", bio: "Friendly, reliable, and always on time. Let's get it done." },
  { id: "p5", name: "Daniel Park", avatar: "https://i.pravatar.cc/200?img=15", verified: false, location: "Seattle, WA", bio: "Bringing craftsmanship and care to every project I take on." },
  { id: "p6", name: "Emma Wilson", avatar: "https://i.pravatar.cc/200?img=49", verified: true, location: "Chicago, IL", bio: "Background-checked pro with hundreds of completed jobs." },
  { id: "p7", name: "Hiro Tanaka", avatar: "https://i.pravatar.cc/200?img=33", verified: true, location: "Portland, OR", bio: "Calm, methodical, and committed to leaving things better than I found them." },
  { id: "p8", name: "Aisha Khan", avatar: "https://i.pravatar.cc/200?img=45", verified: true, location: "Boston, MA", bio: "Premium-quality work with transparent pricing — no surprises." },
  { id: "p9", name: "Lucas Brown", avatar: "https://i.pravatar.cc/200?img=11", verified: false, location: "Denver, CO", bio: "I love what I do and it shows in every booking." },
  { id: "p10", name: "Nina Patel", avatar: "https://i.pravatar.cc/200?img=44", verified: true, location: "Atlanta, GA", bio: "Friendly, fast, and fully insured. Book with confidence." },
];

const raw: Array<Omit<Service, "id" | "slug" | "provider" | "gallery" | "image"> & { providerIdx: number; imageId: string; galleryIds: string[] }> = [
  // Creative & Design
  { titleKey: "service.professional_photographer", title: "Professional Photographer", category: "Creative & Design", categorySlug: "creative-design", description: "Event, portrait, and product photography by award-winning shooters.", longDescription: "Capture the moments that matter with a pro photographer who handles everything from lighting and direction to editing and delivery of high-resolution images.", price: 180, rating: 4.9, reviewCount: 412, providerIdx: 0, imageId: "photo-1554048612-b6a482bc67e5", galleryIds: ["photo-1542038784456-1ea8e935640e", "photo-1452587925148-ce544e77e70d", "photo-1606983340126-99ab4feaa64a"] },
  { titleKey: "service.graphic_designer", title: "Graphic Designer", category: "Creative & Design", categorySlug: "creative-design", description: "Logos, brand kits, social media assets — concept to delivery.", longDescription: "Work 1-on-1 with a senior designer to craft a visual identity that fits your brand. Includes concepts, revisions, and source files.", price: 95, rating: 4.8, reviewCount: 287, providerIdx: 1, imageId: "photo-1561070791-2526d30994b8", galleryIds: ["photo-1626785774573-4b799315345d", "photo-1611532736597-de2d4265fba3"] },
  { titleKey: "service.interior_designer", title: "Interior Designer", category: "Creative & Design", categorySlug: "creative-design", description: "Transform any room with a tailored design plan and shopping list.", longDescription: "On-site consultation, mood boards, 3D renders, and a curated product list to make the space truly yours.", price: 220, rating: 4.7, reviewCount: 156, providerIdx: 5, imageId: "photo-1618221195710-dd6b41faaea6", galleryIds: ["photo-1616486338812-3dadae4b4ace", "photo-1502672260266-1c1ef2d93688"] },
  { titleKey: "service.wedding_dress_designer", title: "Wedding Dress Designer", category: "Creative & Design", categorySlug: "creative-design", description: "Bespoke gowns crafted to flatter, fit, and dazzle on your big day.", longDescription: "From sketch to final fitting, your custom gown is made by hand with premium fabrics and meticulous tailoring.", price: 1200, rating: 5.0, reviewCount: 64, providerIdx: 3, imageId: "photo-1594552072238-b8a33785b261", galleryIds: ["photo-1591604466107-ec97de577aff", "photo-1525258553358-a932c8485f24"] },
  { titleKey: "service.tattoo_artist", title: "Tattoo Artist", category: "Creative & Design", categorySlug: "creative-design", description: "Custom designs in fine line, traditional, blackwork, and more.", longDescription: "Licensed artists working in fully sanitized studios. Free consultation included to shape your idea.", price: 150, rating: 4.9, reviewCount: 312, providerIdx: 4, imageId: "photo-1611501275019-9b5cda994e8d", galleryIds: ["photo-1565058379802-bbe93b2f703a"] },

  // Pet Care
  { titleKey: "service.pet_sitter", title: "Pet Sitter & Dog Walker", category: "Pet Care", categorySlug: "pet-care", description: "Loving care, daily walks, photos, and updates while you're away.", longDescription: "Insured sitters meet your pet beforehand, follow your routine to the letter, and share photo updates after every visit.", price: 35, rating: 4.9, reviewCount: 528, providerIdx: 5, imageId: "photo-1601758228041-f3b2795255f1", galleryIds: ["photo-1587300003388-59208cc962cb", "photo-1548199973-03cce0bbc87b"] },
  { titleKey: "service.dog_trainer", title: "Dog Trainer", category: "Pet Care", categorySlug: "pet-care", description: "Positive-reinforcement training for puppies and adult dogs alike.", longDescription: "Personalized training plans for obedience, leash manners, and behavior correction — in your home or local park.", price: 75, rating: 4.8, reviewCount: 194, providerIdx: 6, imageId: "photo-1450778869180-41d0601e046e", galleryIds: ["photo-1583511655826-05700d52f4d9"] },
  { titleKey: "service.mobile_pet_doctor", title: "Mobile Pet Doctor", category: "Pet Care", categorySlug: "pet-care", description: "Veterinary check-ups, vaccines, and wellness — at your doorstep.", longDescription: "Licensed vets visit your home for low-stress exams, vaccinations, and minor procedures.", price: 110, rating: 4.9, reviewCount: 142, providerIdx: 9, imageId: "photo-1576201836106-db1758fd1c97", galleryIds: ["photo-1612531822439-2bba8feb6587"] },

  // Beauty & Personal Care
  { titleKey: "service.bridal_makeup", title: "Bridal Makeup Artist", category: "Beauty & Personal Care", categorySlug: "beauty-personal", description: "Flawless wedding-day makeup that lasts from ceremony to last dance.", longDescription: "Includes trial session, premium long-wear products, lashes, and on-location service for you and your bridal party.", price: 250, rating: 5.0, reviewCount: 218, providerIdx: 3, imageId: "photo-1487412947147-5cebf100ffc2", galleryIds: ["photo-1522335789203-aaa776c5a01a"] },
  { titleKey: "service.hair_stylist", title: "Hair Stylist", category: "Beauty & Personal Care", categorySlug: "beauty-personal", description: "Cuts, color, balayage, and styling by senior stylists.", longDescription: "Salon-quality service in the comfort of your home. Consultation included to find your perfect look.", price: 90, rating: 4.8, reviewCount: 341, providerIdx: 7, imageId: "photo-1560066984-138dadb4c035", galleryIds: ["photo-1522337360788-8b13dee7a37e"] },
  { titleKey: "service.nail_artist", title: "Nail Artist", category: "Beauty & Personal Care", categorySlug: "beauty-personal", description: "Manicures, pedicures, gel, and custom nail art.", longDescription: "Hygienic, single-use tools and premium polish brands. Group bookings welcome.", price: 55, rating: 4.7, reviewCount: 263, providerIdx: 1, imageId: "photo-1604654894610-df63bc536371", galleryIds: ["photo-1632345031435-8727f6897d53"] },
  { titleKey: "service.mobile_barber", title: "Mobile Barber", category: "Beauty & Personal Care", categorySlug: "beauty-personal", description: "Sharp fades, beard sculpting, and hot-towel shaves at home.", longDescription: "Licensed barbers with premium clippers and all the tools — you just sit back and relax.", price: 45, rating: 4.9, reviewCount: 487, providerIdx: 4, imageId: "photo-1503951914875-452162b0f3f1", galleryIds: ["photo-1622286342621-4bd786c2447c"] },

  // Health & Wellness
  { titleKey: "service.yoga_coach", title: "Yoga & Fitness Coach", category: "Health & Wellness", categorySlug: "health-wellness", description: "Private sessions tailored to your goals, level, and schedule.", longDescription: "Certified coaches design programs around your body and life — strength, mobility, weight loss, or stress relief.", price: 80, rating: 4.9, reviewCount: 376, providerIdx: 5, imageId: "photo-1518611012118-696072aa579a", galleryIds: ["photo-1599901860904-17e6ed7083a0"] },
  { titleKey: "service.massage_therapist", title: "Massage Therapist", category: "Health & Wellness", categorySlug: "health-wellness", description: "Deep tissue, Swedish, sports, and prenatal — at home.", longDescription: "Licensed therapists bring the table, oils, and music. Just choose your style and unwind.", price: 120, rating: 4.9, reviewCount: 521, providerIdx: 7, imageId: "photo-1544161515-4ab6ce6db874", galleryIds: ["photo-1540555700478-4be289fbecef"] },
  { titleKey: "service.physiotherapist", title: "Physiotherapist", category: "Health & Wellness", categorySlug: "health-wellness", description: "Recover from injuries with hands-on treatment and exercise plans.", longDescription: "Assessment, manual therapy, and a structured rehab plan you can do between sessions.", price: 130, rating: 4.8, reviewCount: 198, providerIdx: 2, imageId: "photo-1571019613454-1cb2f99b2d8b", galleryIds: ["photo-1576091160550-2173dba999ef"] },
  { titleKey: "service.wellness_consultant", title: "Wellness Consultant", category: "Health & Wellness", categorySlug: "health-wellness", description: "Holistic guidance for nutrition, sleep, stress, and habits.", longDescription: "Build a sustainable lifestyle plan grounded in evidence — not fads.", price: 100, rating: 4.7, reviewCount: 134, providerIdx: 1, imageId: "photo-1506126613408-eca07ce68773", galleryIds: ["photo-1490645935967-10de6ba17061"] },
  { titleKey: "service.dentist", title: "Dentist Consultation", category: "Health & Wellness", categorySlug: "health-wellness", description: "Virtual or in-clinic check-ups and treatment planning.", longDescription: "Get a second opinion or a full check-up from licensed dentists with modern, gentle care.", price: 95, rating: 4.8, reviewCount: 89, providerIdx: 9, imageId: "photo-1606811971618-4486d14f3f99", galleryIds: ["photo-1588776814546-1ffcf47267a5"] },
  { titleKey: "service.medical_assistant", title: "Medical Assistant", category: "Health & Wellness", categorySlug: "health-wellness", description: "Trained assistants for in-home medical support and monitoring.", longDescription: "Certified medical assistants for vitals, mobility support, and basic care under physician guidance.", price: 65, rating: 4.7, reviewCount: 112, providerIdx: 6, imageId: "photo-1559757148-5c350d0d3c56", galleryIds: ["photo-1551601651-2a8555f1a136"] },

  // Home & Property
  { titleKey: "service.licensed_plumber", title: "Licensed Plumber", category: "Home & Property", categorySlug: "home-property", description: "Leaks, clogs, installs, and emergency calls — 24/7.", longDescription: "Diagnose and fix plumbing issues fast. All work guaranteed and fully insured.", price: 110, rating: 4.8, reviewCount: 432, providerIdx: 0, imageId: "photo-1607472586893-edb57bdc0e39", galleryIds: ["photo-1585704032915-c3400ca199e7"] },
  { titleKey: "service.certified_electrician", title: "Certified Electrician", category: "Home & Property", categorySlug: "home-property", description: "Wiring, fixtures, panels, and smart-home installation.", longDescription: "Licensed electricians handle everything from a flickering light to a full panel upgrade.", price: 125, rating: 4.9, reviewCount: 387, providerIdx: 2, imageId: "photo-1621905251918-48416bd8575a", galleryIds: ["photo-1558618666-fcd25c85cd64"] },
  { titleKey: "service.auto_mechanic", title: "Auto Mechanic", category: "Home & Property", categorySlug: "home-property", description: "On-site car diagnostics, brakes, batteries, and tune-ups.", longDescription: "Skip the shop. Mobile mechanics come to your driveway with the tools and parts you need.", price: 90, rating: 4.7, reviewCount: 256, providerIdx: 4, imageId: "photo-1486262715619-67b85e0b08d3", galleryIds: ["photo-1599256872237-5dcc0fbe9668"] },
  { titleKey: "service.emergency_locksmith", title: "Emergency Locksmith", category: "Home & Property", categorySlug: "home-property", description: "Lockouts, rekeys, and smart-lock installs — fast response.", longDescription: "Bonded locksmiths arrive in under 45 minutes for most metro areas. Flat-rate pricing.", price: 85, rating: 4.8, reviewCount: 198, providerIdx: 8, imageId: "photo-1565793298595-6a879b1d9492", galleryIds: ["photo-1558618047-3c8c76ca7d13"] },
  { titleKey: "service.deep_home_cleaning", title: "Deep Home Cleaning", category: "Home & Property", categorySlug: "home-property", description: "Top-to-bottom cleaning by background-checked pros.", longDescription: "Eco-friendly products, satisfaction guarantee, and same-day availability in most cities.", price: 145, rating: 4.9, reviewCount: 891, providerIdx: 5, imageId: "photo-1581578731548-c64695cc6952", galleryIds: ["photo-1527515637462-cff94eecc1ac", "photo-1584622650111-993a426fbf0a"] },
  { titleKey: "service.carpet_cleaner", title: "Carpet Cleaner", category: "Home & Property", categorySlug: "home-property", description: "Steam cleaning that lifts stains, odors, and allergens.", longDescription: "Truck-mounted equipment, pet-safe solutions, and fast drying times.", price: 95, rating: 4.7, reviewCount: 234, providerIdx: 6, imageId: "photo-1558317374-067fb5f30001", galleryIds: ["photo-1581578017093-cd30fce4eeb7"] },
  { titleKey: "service.window_cleaner", title: "Window Cleaner", category: "Home & Property", categorySlug: "home-property", description: "Streak-free interior and exterior window cleaning.", longDescription: "Pro-grade squeegees, purified water, and high-reach gear for crystal-clear results.", price: 70, rating: 4.8, reviewCount: 167, providerIdx: 7, imageId: "photo-1527515862127-2425e8eedba2", galleryIds: ["photo-1581094288338-2314dddb7ece"] },
  { titleKey: "service.snow_removal", title: "Snow Removal Specialist", category: "Home & Property", categorySlug: "home-property", description: "Driveways, walkways, and roofs cleared safely and quickly.", longDescription: "On-call crews with plows and shovels — book per visit or for the whole season.", price: 60, rating: 4.6, reviewCount: 98, providerIdx: 8, imageId: "photo-1483921020237-2ff51e8e4b22", galleryIds: ["photo-1517176118179-65244903d13c"] },
  { titleKey: "service.junk_removal", title: "Junk Removal Specialist", category: "Home & Property", categorySlug: "home-property", description: "Same-day haul-away of furniture, appliances, and debris.", longDescription: "We load, sweep up, and recycle responsibly. Upfront pricing by the truckload.", price: 175, rating: 4.8, reviewCount: 312, providerIdx: 4, imageId: "photo-1558618666-c52ad1e64eb6", galleryIds: ["photo-1542838132-92c53300491e"] },
  { titleKey: "service.furniture_mover", title: "Furniture Mover", category: "Home & Property", categorySlug: "home-property", description: "Local moves, single items, and assembly — done with care.", longDescription: "Strong, careful movers with blankets, dollies, and straps to protect your stuff.", price: 130, rating: 4.8, reviewCount: 421, providerIdx: 0, imageId: "photo-1600585154340-be6161a56a0c", galleryIds: ["photo-1558959356-2f36bb7dcbb1"] },
  { titleKey: "service.pool_cleaner", title: "Pool Cleaner", category: "Home & Property", categorySlug: "home-property", description: "Weekly maintenance, chemical balancing, and equipment checks.", longDescription: "Crystal-clear water all season with reliable weekly service and seasonal openings/closings.", price: 110, rating: 4.7, reviewCount: 142, providerIdx: 3, imageId: "photo-1505691938895-1758d7feb511", galleryIds: ["photo-1572331165267-854da2b10ccc"] },

  // Personal & Household
  { titleKey: "service.private_driver", title: "Private Driver", category: "Personal & Household", categorySlug: "household-assistance", description: "Personal chauffeurs for airport runs, events, or daily commutes.", longDescription: "Discreet, professional drivers in spotless vehicles. Hourly or per-trip booking.", price: 55, rating: 4.9, reviewCount: 287, providerIdx: 0, imageId: "photo-1449965408869-eaa3f722e40d", galleryIds: ["photo-1485291571150-772bcfc10da5"] },
  { titleKey: "service.driving_instructor", title: "Private Driving Instructor", category: "Personal & Household", categorySlug: "household-assistance", description: "Patient, certified instructors for new and nervous drivers.", longDescription: "Dual-control cars, structured lessons, and prep for your road test.", price: 70, rating: 4.8, reviewCount: 156, providerIdx: 6, imageId: "photo-1581235720704-06d3acfcb36f", galleryIds: ["photo-1502877338535-766e1452684a"] },
  { titleKey: "service.housekeeper", title: "Housekeeper", category: "Personal & Household", categorySlug: "household-assistance", description: "Recurring help with cleaning, laundry, and household tasks.", longDescription: "Vetted, long-term housekeepers matched to your home and routine.", price: 28, rating: 4.9, reviewCount: 612, providerIdx: 5, imageId: "photo-1581578731548-c64695cc6952", galleryIds: ["photo-1556909114-f6e7ad7d3136"] },
  { titleKey: "service.elderly_caretaker", title: "Elderly Caretaker", category: "Personal & Household", categorySlug: "household-assistance", description: "Compassionate, trained caregivers for in-home elder care.", longDescription: "Companionship, meal prep, medication reminders, and mobility support tailored to each client.", price: 32, rating: 4.9, reviewCount: 198, providerIdx: 9, imageId: "photo-1582213782179-e0d53f98f2ca", galleryIds: ["photo-1576765608535-5f04d1e3f289"] },
  { titleKey: "service.midwife", title: "Certified Midwife", category: "Personal & Household", categorySlug: "household-assistance", description: "Prenatal, birth, and postpartum care from licensed midwives.", longDescription: "Personalized, evidence-based care throughout pregnancy and the early months of parenthood.", price: 180, rating: 5.0, reviewCount: 67, providerIdx: 3, imageId: "photo-1518621736915-f3b1c41bfd00", galleryIds: ["photo-1519455953755-af066f52f1a6"] },
  { titleKey: "service.caregiver", title: "Caregiver", category: "Personal & Household", categorySlug: "household-assistance", description: "Reliable in-home care for children, seniors, or recovery support.", longDescription: "Background-checked, CPR-certified caregivers matched to your family's needs.", price: 28, rating: 4.8, reviewCount: 234, providerIdx: 7, imageId: "photo-1576765608535-5f04d1e3f289", galleryIds: ["photo-1591603181847-294ace4d1f8b"] },
  { titleKey: "service.virtual_assistant", title: "Virtual Assistant", category: "Personal & Household", categorySlug: "household-assistance", description: "Inbox, calendar, travel, and research — handled remotely.", longDescription: "Hire by the hour for one-off tasks or by the month for ongoing support.", price: 35, rating: 4.8, reviewCount: 178, providerIdx: 1, imageId: "photo-1573496359142-b8d87734a5a2", galleryIds: ["photo-1521737711867-e3b97375f902"] },

  // Education & Training
  { titleKey: "service.home_tutor", title: "Home Tutor", category: "Education & Training", categorySlug: "education-training", description: "1-on-1 tutoring in math, science, languages, and test prep.", longDescription: "Certified teachers and top students help your child build confidence and grades.", price: 50, rating: 4.9, reviewCount: 412, providerIdx: 6, imageId: "photo-1503676260728-1c00da094a0b", galleryIds: ["photo-1427504494785-3a9ca7044f45"] },
  { titleKey: "service.music_teacher", title: "Music Teacher", category: "Education & Training", categorySlug: "education-training", description: "Guitar, piano, voice, and more for all ages and levels.", longDescription: "Patient instructors who tailor lessons to your favorite styles and goals.", price: 60, rating: 4.9, reviewCount: 256, providerIdx: 4, imageId: "photo-1514320291840-2e0a9bf2a9ae", galleryIds: ["photo-1551225261-fc3a83cc4b5b"] },
  { titleKey: "service.dance_teacher", title: "Dance Teacher", category: "Education & Training", categorySlug: "education-training", description: "Salsa, hip-hop, ballet, contemporary — beginner to advanced.", longDescription: "Private and group lessons in studio or at your home for any occasion.", price: 65, rating: 4.8, reviewCount: 132, providerIdx: 3, imageId: "photo-1508700115892-45ecd05ae2ad", galleryIds: ["photo-1547153760-18fc86324498"] },
  { titleKey: "service.wedding_dancers", title: "Wedding Dancers", category: "Education & Training", categorySlug: "education-training", description: "Choreographed first-dance lessons for couples and parties.", longDescription: "From classic waltz to surprise show-stoppers — leave your guests speechless.", price: 90, rating: 5.0, reviewCount: 78, providerIdx: 3, imageId: "photo-1519741497674-611481863552", galleryIds: ["photo-1583939003579-730e3918a45a"] },

  // Event & Party
  { titleKey: "service.party_organizer", title: "Party & Event Organizer", category: "Event & Party", categorySlug: "event-party", description: "Birthdays, anniversaries, and milestone celebrations done right.", longDescription: "Theming, vendors, staffing, and on-the-day coordination — we handle every detail.", price: 350, rating: 4.9, reviewCount: 167, providerIdx: 3, imageId: "photo-1530103862676-de8c9debad1d", galleryIds: ["photo-1492684223066-81342ee5ff30"] },
  { titleKey: "service.office_party_organizer", title: "Office Party Organizer", category: "Event & Party", categorySlug: "event-party", description: "Corporate retreats, holiday parties, and team events.", longDescription: "Polished, professional events that align with your brand and budget.", price: 480, rating: 4.8, reviewCount: 94, providerIdx: 1, imageId: "photo-1511795409834-ef04bbd61622", galleryIds: ["photo-1540317580384-e5d43616b9aa"] },

  // Business & Professional
  { titleKey: "service.accountant", title: "Accountant", category: "Business & Professional", categorySlug: "business-pro", description: "Bookkeeping, tax filing, and financial advisory for individuals and SMBs.", longDescription: "Licensed CPAs who simplify your books and maximize your deductions.", price: 150, rating: 4.9, reviewCount: 198, providerIdx: 1, imageId: "photo-1554224155-6726b3ff858f", galleryIds: ["photo-1554224154-22dec7ec8818"] },
  { titleKey: "service.legal_advisor", title: "Legal Advisor", category: "Business & Professional", categorySlug: "business-pro", description: "Contracts, business formation, and on-call legal counsel.", longDescription: "Practicing attorneys advise on contracts, employment, and incorporation.", price: 220, rating: 4.8, reviewCount: 134, providerIdx: 8, imageId: "photo-1589994965851-a8f479c573a9", galleryIds: ["photo-1505664194779-8beaceb93744"] },
  { titleKey: "service.marketing_specialist", title: "Marketing Specialist", category: "Business & Professional", categorySlug: "business-pro", description: "SEO, ads, social, and content strategy for growing brands.", longDescription: "Data-driven specialists who craft campaigns that move the needle.", price: 130, rating: 4.8, reviewCount: 156, providerIdx: 1, imageId: "photo-1460925895917-afdab827c52f", galleryIds: ["photo-1551288049-bebda4e38f71"] },
  { titleKey: "service.it_support", title: "IT Support Specialist", category: "Business & Professional", categorySlug: "business-pro", description: "Remote and on-site help for your devices, network, and software.", longDescription: "Fix slow computers, configure networks, recover data, and protect your business.", price: 95, rating: 4.8, reviewCount: 287, providerIdx: 2, imageId: "photo-1581094794329-c8112a89af12", galleryIds: ["photo-1517694712202-14dd9538aa97"] },

  // Travel & Transportation
  { titleKey: "service.car_towing", title: "Car Towing Service", category: "Travel & Transportation", categorySlug: "travel-transport", description: "24/7 emergency towing, jump-starts, and roadside help.", longDescription: "Fast dispatch, flat-rate pricing, and friendly drivers when you need them most.", price: 95, rating: 4.7, reviewCount: 412, providerIdx: 0, imageId: "photo-1543247767-cb1f01a1bbb5", galleryIds: ["photo-1567899378494-47b22a2ae96a"] },
  { titleKey: "service.tour_guide", title: "Local Tour Guide", category: "Travel & Transportation", categorySlug: "travel-transport", description: "Discover hidden gems with passionate, expert local guides.", longDescription: "Custom city walks, food tours, and cultural experiences in dozens of cities.", price: 70, rating: 4.9, reviewCount: 234, providerIdx: 6, imageId: "photo-1503220317375-aaad61436b1b", galleryIds: ["photo-1488646953014-85cb44e25828"] },
  { titleKey: "service.tourist_agency", title: "Tourist Agencies", category: "Travel & Transportation", categorySlug: "travel-transport", description: "Itineraries, bookings, and local logistics handled end-to-end.", longDescription: "Full-service planners who turn your dream trip into a stress-free reality.", price: 180, rating: 4.8, reviewCount: 87, providerIdx: 1, imageId: "photo-1488646953014-85cb44e25828", galleryIds: ["photo-1469854523086-cc02fe5d8800"] },
  { titleKey: "service.storage", title: "Storage Spaces", category: "Travel & Transportation", categorySlug: "travel-transport", description: "Secure short- and long-term storage with flexible access.", longDescription: "Climate-controlled units in safe facilities — pickup and delivery available.", price: 60, rating: 4.6, reviewCount: 112, providerIdx: 7, imageId: "photo-1530124566582-a618bc2615dc", galleryIds: ["photo-1567361808960-dec9cb578182"] },

  // Repair & Customization
  { titleKey: "service.shoe_repair", title: "Shoe Repair Specialist", category: "Repair & Customization", categorySlug: "repair-custom", description: "Resoling, stitching, and restoration for shoes and leather goods.", longDescription: "Skilled cobblers extend the life of your favorite shoes with quality materials.", price: 45, rating: 4.8, reviewCount: 167, providerIdx: 4, imageId: "photo-1542291026-7eec264c27ff", galleryIds: ["photo-1549298916-b41d501d3772"] },
  { titleKey: "service.tailor", title: "Tailor", category: "Repair & Customization", categorySlug: "repair-custom", description: "Alterations, hemming, and custom tailoring with a perfect fit.", longDescription: "Master tailors with decades of experience in suits, dresses, and everyday wear.", price: 40, rating: 4.9, reviewCount: 298, providerIdx: 8, imageId: "photo-1556905055-8f358a7a47b2", galleryIds: ["photo-1593030761757-71fae45fa0e7"] },
  { titleKey: "service.phone_repair", title: "Phone Repair Technician", category: "Repair & Customization", categorySlug: "repair-custom", description: "Same-day screen, battery, and water-damage repair.", longDescription: "Certified techs use OEM-grade parts and back every repair with a warranty.", price: 80, rating: 4.8, reviewCount: 521, providerIdx: 2, imageId: "photo-1601784551446-20c9e07cdbdb", galleryIds: ["photo-1580910051074-3eb694886505"] },
  { titleKey: "service.architect", title: "Architect", category: "Repair & Customization", categorySlug: "repair-custom", description: "Renovation plans, additions, and full custom-home design.", longDescription: "Licensed architects guide your project from concept and permits to construction.", price: 280, rating: 4.9, reviewCount: 78, providerIdx: 1, imageId: "photo-1503387762-592deb58ef4e", galleryIds: ["photo-1496307653780-42ee777d4833"] },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const SERVICES: Service[] = raw.map((s, i) => ({
  ...s,
  id: `s${i + 1}`,
  slug: slugify(s.title),
  image: img(s.imageId),
  gallery: [img(s.imageId), ...s.galleryIds.map(img)],
  provider: providers[s.providerIdx],
}));

export function getService(idOrSlug: string) {
  return SERVICES.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
}

export function getServicesByCategory(slug: string) {
  return SERVICES.filter((s) => s.categorySlug === slug);
}

export const TESTIMONIALS = [
  { id: 1, name: "Jessica Hart", role: "Booked Deep Cleaning", avatar: "https://i.pravatar.cc/150?img=23", rating: 5, text: "Absolutely floored by how easy and professional this was. My place has never looked better." },
  { id: 2, name: "Andre Coleman", role: "Booked Electrician", avatar: "https://i.pravatar.cc/150?img=13", rating: 5, text: "Showed up on time, fixed a wiring issue three other pros couldn't. I'm a customer for life." },
  { id: 3, name: "Maya Rodriguez", role: "Booked Personal Trainer", avatar: "https://i.pravatar.cc/150?img=20", rating: 5, text: "My coach pushed me in the best way. Down 12 lbs and feeling stronger than ever." },
  { id: 4, name: "Tom Beckett", role: "Booked Photographer", avatar: "https://i.pravatar.cc/150?img=8", rating: 5, text: "The photos from my engagement shoot are stunning. Worth every penny." },
];

export const OFFERS = [
  { id: 1, titleKey: "offer.1.title", subKey: "offer.1.sub", ctaKey: "offer.1.cta", accent: "from-primary to-primary-glow" },
  { id: 2, titleKey: "offer.2.title", subKey: "offer.2.sub", ctaKey: "offer.2.cta", accent: "from-emerald-500 to-teal-400" },
  { id: 3, titleKey: "offer.3.title", subKey: "offer.3.sub", ctaKey: "offer.3.cta", accent: "from-sky-500 to-cyan-400" },
];
