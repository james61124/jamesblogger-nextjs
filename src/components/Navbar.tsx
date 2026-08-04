"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CircleUserRound } from "lucide-react";
import { syncUserProfile } from "@/lib/supabase/profile";
const supabase = createClient();

type NavPath = {
  pathname: string;
};

type DropdownItem = {
  label: string;
  description: string;
  path: NavPath;
};

type NavLink = {
  label: string;
  path: NavPath | null;
  hasDropdown?: boolean;
  dropdownItems?: DropdownItem[];
};

const navLinks: NavLink[] = [
  {
    label: "Life",
    path: { pathname: "/life" },
  },
  {
    label: "Travel",
    path: { pathname: "/travel" },
  },
  {
    label: "Program",
    path: null,
    hasDropdown: true,
    dropdownItems: [
      {
        label: "Leetcode Roadmap",
        description: "Structured notes and practice progress.",
        path: { pathname: "/leetcode-roadmap" },
      },
      {
        label: "Leetcode Notes",
        description: "Leetcode solution shared.",
        path: { pathname: "/leetcode" },
      },
      {
        label: "Others",
        description: "Experiments, builds, and technical notes.",
        path: { pathname: "/other" },
      },
    ],
  },
  
];

export default function Navbar() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isHome = pathname === "/";
  const hasSolidBackground = !isHome || (mounted && isScrolled);

  const [user, setUser] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 48);
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProjectsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProjectsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);

      if (user) {
        await syncUserProfile();
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await syncUserProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleAvatarClick() {
    if (!user) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            window.location.pathname + window.location.search
          )}`,
        },
      });
      return;
    }

    setIsUserMenuOpen((v) => !v);
  }

  const isProjectsActive =
    pathname.startsWith("/leetcode-roadmap") ||
    pathname.startsWith("/other") ||
    pathname.startsWith("/program");

  const textColor = hasSolidBackground
    ? "text-[#29251f]"
    : "text-white";

  const mutedTextColor = hasSolidBackground
    ? "text-[#29251f]/72 hover:text-[#29251f]"
    : "text-white/76 hover:text-white";

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={[
        "fixed inset-x-0 top-0 z-50 w-full",
        "transition-[height,background-color,border-color,backdrop-filter]",
        "duration-500 ease-out",
        hasSolidBackground
          ? "h-[72px] border-b border-black/[0.06] bg-[#fffdf8]/82 backdrop-blur-2xl"
          : "h-[78px] border-b border-white/10 bg-black/[0.06] backdrop-blur-[2px]",
      ].join(" ")}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="James Blogger homepage"
          className={[
            "relative z-50 inline-flex items-baseline",
            "transition-opacity duration-300 hover:opacity-80",
            textColor,
          ].join(" ")}
        >
          <span className="font-serif text-[1.65rem] leading-none tracking-[-0.02em] sm:text-[1.8rem]">
            James Blogger
          </span>
        </Link>

        <div className="hidden items-center gap-10 md:flex lg:gap-12">
          {navLinks.map((link) => {
            if (link.hasDropdown && link.dropdownItems) {
              return (
                <div key={link.label} ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProjectsOpen((value) => !value)}
                    aria-expanded={isProjectsOpen}
                    className={[
                      "group relative flex items-center gap-1.5",
                      "text-[15px] font-medium tracking-[0.025em]",
                      "transition-colors duration-300",
                      isProjectsActive ? textColor : mutedTextColor,
                    ].join(" ")}
                  >
                    <span>{link.label}</span>

                    <motion.span
                      animate={{ rotate: isProjectsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex"
                    >
                      <ChevronDown size={15} strokeWidth={1.7} />
                    </motion.span>

                    <span
                      className={[
                        "absolute -bottom-2 left-0 h-px w-full origin-left",
                        "bg-current transition-transform duration-300",
                        isProjectsActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100",
                      ].join(" ")}
                    />
                  </button>

                  <AnimatePresence>
                    {isProjectsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.985 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={[
                          "absolute right-0 top-full mt-5 w-[310px]",
                          "overflow-hidden rounded-2xl border border-black/[0.06]",
                          "bg-[#fffdf8]/95 p-2 backdrop-blur-2xl",
                          "shadow-[0_18px_60px_rgba(32,25,16,0.14)]",
                        ].join(" ")}
                      >
                        {link.dropdownItems.map((item) => {
                          const active = pathname === item.path.pathname;

                          return (
                            <Link
                              key={item.label}
                              href={item.path}
                              className={[
                                "group block rounded-xl px-4 py-3.5",
                                "transition-colors duration-200",
                                active
                                  ? "bg-black/[0.045]"
                                  : "hover:bg-black/[0.035]",
                              ].join(" ")}
                            >
                              <span className="block text-[14px] font-semibold tracking-[0.01em] text-[#29251f]">
                                {item.label}
                              </span>
                              <span className="mt-1 block text-[12px] leading-5 text-[#6f675d]">
                                {item.description}
                              </span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            if (!link.path) return null;

            const active = pathname === link.path.pathname;

            return (
              <Link
                key={link.label}
                href={link.path}
                className={[
                  "group relative text-[15px] font-medium tracking-[0.025em]",
                  "transition-colors duration-300",
                  active ? textColor : mutedTextColor,
                ].join(" ")}
              >
                {link.label}

                <span
                  className={[
                    "absolute -bottom-2 left-0 h-px w-full origin-left",
                    "bg-current transition-transform duration-300",
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  ].join(" ")}
                />
              </Link>
            );
          })}

          <div className="relative" ref={userMenuRef}>
            <button
              onClick={handleAvatarClick}
              className="overflow-hidden rounded-full transition-opacity hover:opacity-80 cursor-pointer"
            >
              {user ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="h-9 w-9 rounded-full border border-black/10"
                />
              ) : (
                <div
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full transition",
                    hasSolidBackground
                      ? "border border-black/10 text-[#29251f] hover:border-black/25"
                      : "border border-white/25 text-white/80 hover:border-white/60 hover:text-white",
                  ].join(" ")}
                >
                  <CircleUserRound size={22} />
                </div>
              )}
            </button>

            <AnimatePresence>
              {user && isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 mt-4 w-72 rounded-2xl border border-black/5 bg-[#fffdf8] p-5 shadow-xl"
                >
                  {user ? (
                    <>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.user_metadata.avatar_url}
                          className="h-12 w-12 rounded-full"
                        />

                        <div>
                          <p className="font-medium">
                            {user.user_metadata.full_name}
                          </p>

                          <p className="text-sm text-[#746b60]">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="my-4 border-t border-black/8" />

                      <button
                        onClick={async () => {
                          await createClient().auth.signOut();
                        }}
                        className="mt-5 cursor-pointer text-sm text-[#746b60] transition-colors hover:text-black"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() =>
                        createClient().auth.signInWithOAuth({
                          provider: "google",
                          options: {
                            redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                              window.location.pathname + window.location.search
                            )}`,
                          },
                        })
                      }
                      className="cursor-pointer text-sm font-medium text-[#746b60] transition-colors hover:text-[#29251f]"
                    >
                      Sign in
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((value) => !value)}
          className={[
            "relative z-50 inline-flex h-10 w-10 items-center justify-center",
            "rounded-full border transition-colors duration-300 md:hidden",
            hasSolidBackground
              ? "border-black/10 bg-black/[0.025] text-[#29251f]"
              : "border-white/15 bg-white/[0.06] text-white",
          ].join(" ")}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isOpen ? "close" : "menu"}
              initial={{ opacity: 0, rotate: -16, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 16, scale: 0.9 }}
              transition={{ duration: 0.16 }}
              className="inline-flex"
            >
              {isOpen ? (
                <X size={20} strokeWidth={1.7} />
              ) : (
                <Menu size={21} strokeWidth={1.7} />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 top-full border-b border-black/[0.06] bg-[#f7f1e7]/97 px-6 pb-8 pt-5 shadow-[0_18px_50px_rgba(32,25,16,0.12)] backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto max-w-lg">
              {navLinks.map((link) => {
                if (link.hasDropdown && link.dropdownItems) {
                  return (
                    <div
                      key={link.label}
                      className="border-b border-black/[0.07] py-4"
                    >
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a7f70]">
                        {link.label}
                      </p>

                      <div className="space-y-1">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.path}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.035]"
                          >
                            <span className="block font-serif text-[1.35rem] leading-tight text-[#29251f]">
                              {item.label}
                            </span>
                            <span className="mt-1 block text-[12px] leading-5 text-[#746b60]">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (!link.path) return null;

                return (
                  <Link
                    key={link.label}
                    href={link.path}
                    className="flex items-center justify-between border-b border-black/[0.07] px-1 py-4 font-serif text-[1.65rem] text-[#29251f]"
                  >
                    <span>{link.label}</span>
                    <span className="text-base text-[#8a7f70]">↗</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
