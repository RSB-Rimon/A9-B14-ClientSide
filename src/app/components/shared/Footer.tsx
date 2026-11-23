import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "My Appointments", href: "/customer/dashboard/appointments" },
  { label: "Sign In", href: "/sign-in" },
];

const socialLinks: { name: string; href?: string }[] = [
  { name: "Instagram" },
  { name: "Facebook" },
  { name: "TikTok" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#29251f] text-[#f5eee5]">
      <div className="container-custom py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <section className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#b58b57] text-xl font-semibold text-[#29251f]">
                S
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">
                Salon<span className="text-[#d6b98f]">Book</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-[#c8beb1]">
              Browse salon services, request appointments, and keep your
              bookings in one place.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Important Links
            </h2>
            <ul className="mt-5 space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#c8beb1] transition hover:text-[#d6b98f]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Contact
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-[#c8beb1]">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-[#d6b98f]" />
                <span>[Add salon phone number]</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-[#d6b98f]" />
                <span>[Add salon email address]</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Visit Us
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-[#c8beb1]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#d6b98f]" />
                <span>[Add salon address]</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-[#d6b98f]" />
                <span>[Add opening days and hours]</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Social Media</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {socialLinks.map((social) =>
                social.href ? (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-[#c8beb1] transition hover:border-[#d6b98f] hover:text-white"
                  >
                    <Share2 className="size-3.5" />
                    {social.name}
                    <ArrowUpRight className="size-3" />
                  </a>
                ) : (
                  <span
                    key={social.name}
                    className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/20 px-3 py-2 text-xs text-[#c8beb1]"
                    title={`${social.name} profile link placeholder`}
                  >
                    <Share2 className="size-3.5" />
                    {social.name}: [Add profile link]
                  </span>
                ),
              )}
            </div>
          </div>

          <p className="text-sm text-[#a99e91]">
            © {new Date().getFullYear()} SalonBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
