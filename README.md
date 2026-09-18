# SkillBuddy

SkillBuddy is a modern skills and services marketplace built for connecting clients with trusted service professionals. The platform makes it easy to discover services, browse categories, register as a provider, manage user accounts, and access a personalized dashboard experience in a polished, responsive app.

Built with React, TypeScript, TanStack Router, and Tailwind CSS, SkillBuddy is designed for a fast, scalable, and user-friendly digital marketplace experience.

## Why SkillBuddy

SkillBuddy helps people:

- Discover services by category and keyword
- Explore professional offerings in a clean marketplace UI
- Sign up, sign in, and manage account flows
- Apply to become a verified service provider
- Access tailored dashboards and profile management
- Communicate with the platform through guided user journeys

## Key Features

- Service marketplace and category browsing
- Search and filter for providers and services
- Provider onboarding and registration flows
- Secure authentication and account management
- User dashboard and profile experience
- Responsive design for desktop and mobile users
- Rich landing pages for services, careers, FAQs, and contact
- Supabase-powered backend integration
- Modern UI using Tailwind CSS and shadcn-style patterns

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Start
- TanStack Router
- Tailwind CSS
- Framer Motion
- Supabase
- Zod
- React Hook Form
- shadcn/ui inspired component system

## Project Structure

```bash
Skill-buddy/
├── src/
│   ├── components/         # Reusable UI and section components
│   ├── context/            # Auth and app context providers
│   ├── hooks/              # Custom hooks for data fetching and app logic
│   ├── lib/                # Shared utilities, API logic, and app config
│   ├── routes/             # File-based route structure
│   ├── assets/             # Static images and icons
│   ├── router.tsx          # Router setup
│   ├── server.ts           # Server config
│   ├── start.ts            # App startup config
│   ├── styles.css          # Global styles
│   └── routeTree.gen.ts    # Auto-generated router tree
├── public/                 # Static assets and public files
├── supabase/               # Supabase configuration and related resources
├── scripts/                # Build and deployment scripts
├── package.json            # Project dependencies and scripts
├── vite.config.ts          # Vite config
├── tsconfig.json           # TypeScript config
├── components.json         # Component configuration
├── .gitignore              # Git ignore rules
├── LICENSE                 # (if added later) project license
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

Before running the app, make sure you have the following installed:

- Node.js 18+
- npm or bun

### Installation

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

The app will start in development mode using Vite. Open the local URL shown in your terminal to view it in the browser.

## Environment Variables

This project connects to Supabase for authentication and data. Configure the required environment variables before running the app.

Create a `.env` file in the project root and add values such as:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You may also need additional values depending on your environment and deployment setup.

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Build the production app
npm run preview   # Preview the production build
npm run lint      # Run ESLint checks
npm run format    # Format the project with Prettier
```

## Use Cases

SkillBuddy is suitable for:

- Service marketplaces
- Freelancer discovery platforms
- Local service booking experiences
- Professional onboarding portals
- B2C marketplace applications

## Contributing

Contributions are welcome. If you want to improve the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and validation
5. Submit a pull request with a clear description

## License

This project is currently configured as a private/internal app unless a license file is later added. If you plan to publish or distribute it publicly, add a proper open-source license before release.

## Contact

For questions or collaboration opportunities, reach out through the project repository or contact the maintainer directly.

## Summary

SkillBuddy is a polished marketplace application designed to simplify the connection between clients and skilled professionals. With a modern frontend, responsive layout, and scalable architecture, it is well-suited for service discovery, provider onboarding, and digital commerce workflows.

---

Built with care for modern user experiences and scalable marketplace functionality.
