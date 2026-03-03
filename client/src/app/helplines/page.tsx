"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { helplinesApi } from "@/lib/api";
import { t } from "@/lib/i18n";
import { Phone, AlertTriangle, Heart, Shield, Monitor, Landmark, ShoppingBag } from "lucide-react";
import clsx from "clsx";

const categoryIcons: Record<string, any> = {
  Emergency: AlertTriangle,
  "Women & Child": Heart,
  Cyber: Monitor,
  "Legal Aid": Shield,
  Government: Landmark,
  Consumer: ShoppingBag,
  General: Phone,
};

const categoryColors: Record<string, string> = {
  Emergency: "bg-red-50 border-red-200 text-red-700",
  "Women & Child": "bg-pink-50 border-pink-200 text-pink-700",
  Cyber: "bg-cyan-50 border-cyan-200 text-cyan-700",
  "Legal Aid": "bg-blue-50 border-blue-200 text-blue-700",
  Government: "bg-purple-50 border-purple-200 text-purple-700",
  Consumer: "bg-amber-50 border-amber-200 text-amber-700",
  General: "bg-gray-50 border-gray-200 text-gray-700",
};

export default function HelplinesPage() {
  const { language } = useAppStore();
  const isHi = language === "hi";

  const { data: helplines, isLoading } = useQuery({
    queryKey: ["helplines"],
    queryFn: () => helplinesApi.list().then((r) => r.data),
  });

  // Group by category
  const grouped: Record<string, any[]> = {};
  (helplines || []).forEach((h: any) => {
    if (!grouped[h.category]) grouped[h.category] = [];
    grouped[h.category].push(h);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Phone className="w-8 h-8 text-red-500" />
        <h1 className="section-title">{t(language, "helplinesTitle")}</h1>
      </div>
      <p className="text-gray-600 mb-8">
        {isHi ? "ये सभी हेल्पलाइन भारत सरकार द्वारा संचालित हैं और 24/7 उपलब्ध हैं।" : "These helplines are operated by the Government of India and are available 24/7."}
      </p>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card animate-pulse"><div className="h-5 bg-gray-200 rounded w-1/3" /></div>)}</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => {
            const IconComp = categoryIcons[category] || Phone;
            const colorClass = categoryColors[category] || categoryColors.General;

            return (
              <div key={category}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <IconComp className="w-5 h-5" />
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {items.map((h: any) => (
                    <div key={h.id} className={clsx("rounded-xl border p-5", colorClass)}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{isHi ? h.nameHi : h.name}</h3>
                        {h.isNational && (
                          <span className="text-xs bg-white bg-opacity-60 px-2 py-0.5 rounded-full">
                            {isHi ? "राष्ट्रीय" : "National"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm opacity-80 mb-4">{isHi ? h.descriptionHi : h.description}</p>
                      <a href={`tel:${h.number}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg font-bold text-lg shadow-sm hover:shadow-md transition-shadow">
                        <Phone className="w-5 h-5" />
                        {h.number}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
