import { ArrowUpRight } from "lucide-react";

const APPS = [
  {
    name: "FitMyCV",
    logo: "/apps/fitmycv.svg",
    description:
      "Tailor your CV for every job and auto-write matching cover letters.",
    href: "https://www.fitmycv.link/",
  },
  {
    name: "LinkGenie",
    logo: "/apps/linkgenie.svg",
    description: "Write, schedule, and autopilot your LinkedIn posts.",
    href: "https://www.linkgenie.one/",
  },
  {
    name: "WaitFast",
    logo: "/apps/waitfast.png",
    description:
      "Launch waitlist pages and widgets, email every signup when you ship.",
    href: "https://waitfast.one/",
  },
  {
    name: "PayFari",
    logo: "/apps/payfari.png",
    description: "Open EU/US bank accounts and crypto wallets from anywhere.",
    href: "https://waitlist.payfari.com/",
  },
  {
    name: "LaunchMe",
    logo: "/apps/launchme.png",
    description: "Launch your product and get it in front of early adopters.",
    href: "https://www.launchme.site/",
  },
];

export function MyApps() {
  return (
    <aside className="hidden w-[320px] flex-col border-l border-neutral-200 bg-white lg:flex">
      <div className="border-b border-neutral-200 px-5 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          Built by the maker
        </p>
        <p className="mt-1 text-sm text-neutral-600">
          Other apps from the person behind LogoPop.
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {APPS.map((app) => (
          <a
            key={app.name}
            href={app.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-neutral-50">
              <img
                src={app.logo}
                alt={`${app.name} logo`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1 pr-4">
              <span className="text-sm font-semibold text-neutral-900">
                {app.name}
              </span>
              <span className="text-xs leading-snug text-neutral-500">
                {app.description}
              </span>
            </div>
            <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-neutral-400 transition group-hover:text-neutral-700" />
          </a>
        ))}
      </div>
    </aside>
  );
}
