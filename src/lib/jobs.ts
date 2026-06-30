export type Job = {
  id: string;
  title: string;
  titleKey: string;
  descKey: string;
  category: string;
  categorySlug: string;
  location: string;
  budgetMin: number;
  budgetMax: number;
  postedHoursAgo: number;
  urgency: "URGENT" | "REGULAR";
  bids: number;
  description: string;
};

export const JOBS: Job[] = [
  { id: "j1", title: "Deep clean for 3-bedroom apartment", titleKey: "job.1.title", descKey: "job.1.desc", category: "Cleaning", categorySlug: "cleaning", location: "Tallinn, Kesklinn", budgetMin: 80, budgetMax: 140, postedHoursAgo: 2, urgency: "URGENT", bids: 7, description: "Move-out clean, kitchen and 2 bathrooms included." },
  { id: "j2", title: "Fix leaking kitchen sink", titleKey: "job.2.title", descKey: "job.2.desc", category: "Plumbing", categorySlug: "plumbing", location: "Riga, Centra", budgetMin: 40, budgetMax: 90, postedHoursAgo: 1, urgency: "URGENT", bids: 4, description: "Drip under the trap, probably needs gasket replacement." },
  { id: "j3", title: "Help moving 1-bedroom flat", titleKey: "job.3.title", descKey: "job.3.desc", category: "Shifting & Moving", categorySlug: "shifting", location: "Vilnius, Naujamiestis", budgetMin: 150, budgetMax: 250, postedHoursAgo: 12, urgency: "REGULAR", bids: 11, description: "Saturday afternoon, ~15 boxes plus sofa and bed." },
  { id: "j4", title: "Paint living room walls", titleKey: "job.4.title", descKey: "job.4.desc", category: "Painting", categorySlug: "painting", location: "Tartu, Annelinn", budgetMin: 200, budgetMax: 400, postedHoursAgo: 24, urgency: "REGULAR", bids: 6, description: "~28 m², neutral colour, paint provided." },
  { id: "j5", title: "AC not cooling — diagnose and fix", titleKey: "job.5.title", descKey: "job.5.desc", category: "AC Repair", categorySlug: "ac-repair", location: "Pärnu, Rääma", budgetMin: 60, budgetMax: 180, postedHoursAgo: 4, urgency: "URGENT", bids: 3, description: "Split unit, no cold air. Built 2019." },
  { id: "j6", title: "Bridal makeup for wedding day", titleKey: "job.6.title", descKey: "job.6.desc", category: "Makeup Artist", categorySlug: "makeup", location: "Tallinn, Kalamaja", budgetMin: 180, budgetMax: 320, postedHoursAgo: 36, urgency: "REGULAR", bids: 9, description: "Bride + 2 bridesmaids, trial run welcome." },
  { id: "j7", title: "Math tutor for 10th grader", titleKey: "job.7.title", descKey: "job.7.desc", category: "Home Tutor", categorySlug: "tutor", location: "Online", budgetMin: 25, budgetMax: 45, postedHoursAgo: 8, urgency: "REGULAR", bids: 12, description: "Algebra 2, twice a week, evenings." },
  { id: "j8", title: "Dog walker, weekday mornings", titleKey: "job.8.title", descKey: "job.8.desc", category: "Pet Care", categorySlug: "pet-care", location: "Riga, Mežaparks", budgetMin: 15, budgetMax: 25, postedHoursAgo: 18, urgency: "REGULAR", bids: 8, description: "Golden retriever, 30 min walks, Mon–Fri." },
  { id: "j9", title: "iPhone 13 screen replacement", titleKey: "job.9.title", descKey: "job.9.desc", category: "Phone Repair", categorySlug: "phone-repair", location: "Kaunas, Old Town", budgetMin: 80, budgetMax: 150, postedHoursAgo: 6, urgency: "URGENT", bids: 5, description: "Cracked glass, touch still works. Need it today." },
  { id: "j10", title: "Wedding photographer for 6 hours", titleKey: "job.10.title", descKey: "job.10.desc", category: "Photography", categorySlug: "photography", location: "Tallinn, Pirita", budgetMin: 500, budgetMax: 900, postedHoursAgo: 72, urgency: "REGULAR", bids: 14, description: "Ceremony + reception, edited photos delivered in 2 weeks." },
  { id: "j11", title: "Electrical socket installation x4", titleKey: "job.11.title", descKey: "job.11.desc", category: "Electrician", categorySlug: "electrician", location: "Vilnius, Žirmūnai", budgetMin: 120, budgetMax: 220, postedHoursAgo: 14, urgency: "REGULAR", bids: 7, description: "4 new sockets in kitchen, wiring exists." },
  { id: "j12", title: "Lockout — need locksmith now", titleKey: "job.12.title", descKey: "job.12.desc", category: "Locksmith", categorySlug: "locksmith", location: "Riga, Āgenskalns", budgetMin: 50, budgetMax: 120, postedHoursAgo: 0, urgency: "URGENT", bids: 2, description: "Standard apartment door, no key." },
];
