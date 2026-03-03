"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Phone, Scale, Menu, X, Globe } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { language, toggleLanguage, user, logout } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: "/", label: t(language, "navHome") },
    { href: "/rights", label: t(language, "navRights") },
    { href: "/directory", label: t(language, "navDirectory") },
    { href: "/helplines", label: t(language, "navHelplines") },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-navy-500" />
            <div>
              <span className="text-xl font-bold text-navy-500">{t(language, "brand")}</span>
              <span className="hidden sm:block text-xs text-gray-500">{t(language, "brandSub")}</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-700 hover:text-navy-500 transition-colors">
                {l.label}
              </Link>
            ))}
            {user && (
              <Link href="/my-issues" className="text-sm font-medium text-gray-700 hover:text-navy-500 transition-colors">
                {t(language, "navMyIssues")}
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Emergency */}
            <a href="tel:112" className="btn-emergency hidden sm:flex">
              <Phone className="w-4 h-4" />
              <span>{t(language, "emergency")}</span>
            </a>

            {/* Language Toggle */}
            <button onClick={toggleLanguage} className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-colors" title="Switch language">
              <Globe className="w-4 h-4" />
              {t(language, "langToggle")}
            </button>

            {/* Auth */}
            {user ? (
              <button onClick={logout} className="text-sm text-gray-600 hover:text-red-600">{t(language, "navLogout")}</button>
            ) : (
              <Link href="/login" className="text-sm font-medium text-navy-500 hover:underline">{t(language, "navLogin")}</Link>
            )}

            {/* Mobile Menu */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-navy-500 font-medium">
                {l.label}
              </Link>
            ))}
            {user && (
              <Link href="/my-issues" onClick={() => setMobileOpen(false)} className="block py-2 text-gray-700 hover:text-navy-500 font-medium">
                {t(language, "navMyIssues")}
              </Link>
            )}
            <a href="tel:112" className="block py-2 text-red-600 font-bold">{t(language, "emergency")}</a>
          </div>
        </div>
      )}
    </header>
  );
}
