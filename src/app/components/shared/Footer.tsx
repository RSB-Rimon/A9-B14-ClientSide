import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Scissors,
} from "lucide-react";

// -------------------- Edit your salon details here --------------------
// Leave a value empty ("") to show a placeholder until you add the real one.

const salon = {
  phone: "",
  email: "",
  address: "",
};

const openingHours: { days: string; time: string }[] = [
  { days: "Monday to Friday", time: "" },
  { days: "Saturday", time: "" },
  { days: "Sunday", time: "" },
];

const socialLinks: { name: string; href: string }[] = [
  { name: "Instagram", href: "" },
  { name: "Facebook", href: "" },
  { name: "TikTok", href: "" },
];

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Browse services", href: "/services" },
  { label: "My appointments", href: "/customer/dashboard/appointments" },
  { label: "Sign in", href: "/sign-in" },
];

// -------------------- Small helpers --------------------

function Placeholder({ children }: { children: string }) {
  return <span className="italic text-[#8f7f75]">{children}</span>;
}

function ColumnTitle({ children }: { children: string }) {
  return (
    <h2 className="font-serif text-[19px] font-medium tracking-tight text-white">
      {children}
    </h2>
  );
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[#e3b9a9]">
      {children}
    </span>
  );
}

// -------------------- Footer --------------------

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#faf8f5] pt-6">
      <div className="relative overflow-hidden rounded-t-[32px] bg-[#3a2d26] text-[#e9dfd6]">
        {/* soft background shapes */}
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-white/[0.03]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 size-96 rounded-full bg-[#a66d5c]/10" />

        <div className="container-custom relative py-12 sm:py-16">
          {/* Booking prompt */}
          <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="font-serif text-2xl tracking-tight text-white sm:text-[28px]">
                Ready for your next appointment?
              </p>
              <p className="mt-1.5 text-sm text-[#c9bdb2]">
                Pick a service and choose a time that suits you.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f1ece6] px-6 text-sm font-semibold text-[#3a2d26] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e3b9a9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a2d26]"
            >
              Browse services
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          {/* Main columns */}
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.1fr] lg:gap-12">
            {/* Logo + description */}
            <section>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#f1ece6] text-[#3a2d26]">
                  <Scissors className="size-5" strokeWidth={1.7} />
                </span>
                <span className="text-2xl font-semibold tracking-tight text-white">
                  SalonBook
                </span>
              </Link>

              <p className="mt-5 max-w-xs text-sm leading-7 text-[#c9bdb2]">
                Browse salon services, request appointments and keep all your
                bookings in one place.
              </p>
            </section>

            {/* Navigation */}
            <nav aria-label="Footer">
              <ColumnTitle>Explore</ColumnTitle>
              <ul className="mt-5 space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#c9bdb2] transition hover:text-white hover:underline hover:underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact + address */}
            <section>
              <ColumnTitle>Get in touch</ColumnTitle>
              <ul className="mt-5 space-y-4 text-sm text-[#c9bdb2]">
                <li className="flex items-start gap-3">
                  <IconBadge>
                    <Phone className="size-4" />
                  </IconBadge>
                  <div className="pt-1.5">
                    {salon.phone ? (
                      <a
                        href={`tel:${salon.phone.replace(/\s/g, "")}`}
                        className="transition hover:text-white"
                      >
                        {salon.phone}
                      </a>
                    ) : (
                      <Placeholder>Add salon phone number</Placeholder>
                    )}
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <IconBadge>
                    <Mail className="size-4" />
                  </IconBadge>
                  <div className="pt-1.5 break-all">
                    {salon.email ? (
                      <a
                        href={`mailto:${salon.email}`}
                        className="transition hover:text-white"
                      >
                        {salon.email}
                      </a>
                    ) : (
                      <Placeholder>Add salon email address</Placeholder>
                    )}
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <IconBadge>
                    <MapPin className="size-4" />
                  </IconBadge>
                  <div className="pt-1.5 leading-6">
                    {salon.address ? (
                      salon.address
                    ) : (
                      <Placeholder>Add salon address</Placeholder>
                    )}
                  </div>
                </li>
              </ul>
            </section>

            {/* Opening hours */}
            <section>
              <div className="flex items-center gap-2.5">
                <Clock3 className="size-[18px] text-[#e3b9a9]" />
                <ColumnTitle>Opening hours</ColumnTitle>
              </div>

              <dl className="mt-5 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.04] text-sm">
                {openingHours.map((row) => (
                  <div
                    key={row.days}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <dt className="text-[#c9bdb2]">{row.days}</dt>
                    <dd className="text-right text-white">
                      {row.time ? row.time : <Placeholder>Add hours</Placeholder>}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="text-sm text-[#c9bdb2]">Follow us</span>

              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((social) =>
                  social.href ? (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-xs font-medium text-[#e9dfd6] transition hover:border-[#e3b9a9] hover:bg-white/[0.06] hover:text-white"
                    >
                      {social.name}
                      <ArrowUpRight className="size-3" />
                    </a>
                  ) : (
                    <span
                      key={social.name}
                      title={`Add your ${social.name} link in Footer.tsx`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/20 px-3.5 py-2 text-xs text-[#a99a8f]"
                    >
                      {social.name}
                    </span>
                  ),
                )}
              </div>
            </div>

            <p className="text-sm text-[#a99a8f]">
              © {new Date().getFullYear()} SalonBook. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
