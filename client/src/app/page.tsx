"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { categoriesApi, helplinesApi } from "@/lib/api";
import { t } from "@/lib/i18n";
import {
  Users, Home, Shield, Briefcase, ShoppingBag, Heart, Monitor, FileText,
  ArrowRight, Phone, Scale, Sparkles, ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const iconMap: Record<string, any> = {
  Users, Home, Shield, Briefcase, ShoppingBag, Heart, Monitor, FileText,
};

export default function HomePage() {
  const { language } = useAppStore();
  const isHi = language === "hi";

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then((r) => r.data),
  });

  const { data: helplines } = useQuery({
    queryKey: ["helplines"],
    queryFn: () => helplinesApi.list().then((r) => r.data),
  });

  return (
    <div>
      {/* ── Hero ─────────────────────────── */}
      <section className="relative bg-gradient-to-br from-violet-950 via-purple-900 to-rose-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-saffron-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-rose-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-10 h-10 text-saffron-400" />
              <Sparkles className="w-6 h-6 text-saffron-300 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {t(language, "heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              {t(language, "heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/intake" className="btn-saffron text-lg px-8 py-4">
                <Sparkles className="w-5 h-5 mr-2" />
                {t(language, "heroBtn")}
              </Link>
              <a href="#categories" className="btn-outline border-white text-white hover:bg-white hover:text-purple-900 text-lg px-8 py-4">
                {t(language, "heroBtnAlt")}
                <ChevronRight className="w-5 h-5 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency Banner ─────────────── */}
      <section className="bg-red-50 border-y border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <span className="font-semibold text-red-700">
              {isHi ? "आपातकालीन?" : "In Emergency?"}
            </span>
            {(helplines || []).slice(0, 5).map((h: any) => (
              <a key={h.id} href={`tel:${h.number}`} className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium">
                <Phone className="w-3.5 h-3.5" />
                {isHi ? h.nameHi : h.name}: <span className="font-bold">{h.number}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories Grid ──────────────── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">{t(language, "categoriesTitle")}</h2>
          <p className="text-gray-600 text-lg">{t(language, "categoriesSubtitle")}</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(categories || []).map((cat: any, i: number) => {
              const IconComp = iconMap[cat.icon] || FileText;
              const colors = [
                "bg-saffron-50 text-saffron-600",
                "bg-forest-50 text-forest-600",
                "bg-blue-50 text-blue-600",
                "bg-purple-50 text-purple-600",
                "bg-pink-50 text-pink-600",
                "bg-red-50 text-red-600",
                "bg-cyan-50 text-cyan-600",
                "bg-emerald-50 text-emerald-600",
              ];

              return (
                <Link key={cat.id} href={`/intake?category=${cat.id}`}
                  className="card group cursor-pointer hover:border-navy-300">
                  <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center mb-4", colors[i % colors.length])}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-navy-500 transition-colors">
                    {isHi ? cat.nameHi : cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {isHi ? cat.descriptionHi : cat.description}
                  </p>
                  <div className="flex items-center text-navy-500 text-sm font-medium">
                    {isHi ? "शुरू करें" : "Get Started"}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── How It Works ─────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">
            {isHi ? "यह कैसे काम करता है?" : "How It Works"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: isHi ? "अपनी समस्या बताएं" : "Describe Your Issue",
                desc: isHi ? "सरल भाषा में अपनी कानूनी समस्या बताएं। AI आपके मामले को समझेगा।" : "Explain your legal issue in simple language. AI will understand your case.",
              },
              {
                step: "2",
                title: isHi ? "अपने अधिकार जानें" : "Know Your Rights",
                desc: isHi ? "लागू कानूनों और अपने अधिकारों की जानकारी प्राप्त करें।" : "Learn about applicable laws and your legal rights.",
              },
              {
                step: "3",
                title: isHi ? "कार्य योजना प्राप्त करें" : "Get Action Plan",
                desc: isHi ? "चरण-दर-चरण कार्य योजना प्राप्त करें — किस कार्यालय में जाएं, कौन से दस्तावेज़ लें।" : "Get a step-by-step plan — which office to visit, what documents to carry.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-purple-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
