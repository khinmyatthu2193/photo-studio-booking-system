export const siteConfig = {
  name: "Snapora",
  title: "Snapora — Photography Studio Booking Platform",
  description:
    "An editorial photography studio experience for exploring work and requesting a session.",
  studio: {
    address: null,
    email: null,
    hours: null,
    phone: null,
  },
  publicNavigation: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Packages", href: "/packages" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  adminNavigation: [
    { label: "Overview", href: "/admin" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Calendar", href: "/admin/calendar" },
    { label: "Packages", href: "/admin/packages" },
    { label: "Add-ons", href: "/admin/addons" },
    { label: "Portfolio", href: "/admin/portfolio" },
    { label: "Availability", href: "/admin/availability" },
    { label: "Settings", href: "/admin/settings" },
  ],
} as const;
