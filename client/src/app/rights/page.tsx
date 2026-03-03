"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { rightsApi } from "@/lib/api";
import { t } from "@/lib/i18n";
import { Shield, ChevronDown, ChevronRight, BookOpen, Scale } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export default function RightsPage() {
  const { language } = useAppStore();
  const isHi = language === "hi";
  const [expandedSub, setExpandedSub] = useState<Set<string>>(new Set());
  const [expandedRight, setExpandedRight] = useState<Set<string>>(new Set());

  const { data: categories, isLoading } = useQuery({
    queryKey: ["rights-all"],
    queryFn: () => rightsApi.all().then((r) => r.data),
  });

  function toggleSub(id: string) {
    setExpandedSub((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function toggleRight(id: string) {
    setExpandedRight((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-saffron-500" />
        <h1 className="section-title">{t(language, "rightsTitle")}</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card animate-pulse"><div className="h-5 bg-gray-200 rounded w-1/2" /></div>)}</div>
      ) : (
        <div className="space-y-6">
          {(categories || []).map((cat: any) => (
            <div key={cat.id} className="card">
              <h2 className="text-lg font-bold text-navy-700 mb-4">{isHi ? cat.nameHi : cat.name}</h2>

              {cat.subCategories?.length === 0 ? (
                <p className="text-sm text-gray-400">{isHi ? "कोई उपश्रेणी नहीं" : "No sub-categories yet"}</p>
              ) : (
                <div className="space-y-3">
                  {cat.subCategories.map((sub: any) => (
                    <div key={sub.id} className="border rounded-lg">
                      <button onClick={() => toggleSub(sub.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <span className="font-medium text-gray-800">{isHi ? sub.nameHi : sub.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{sub.rights?.length || 0} {isHi ? "अधिकार" : "rights"}</span>
                          {expandedSub.has(sub.id) ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </div>
                      </button>

                      {expandedSub.has(sub.id) && (
                        <div className="px-4 pb-4 space-y-3">
                          {(sub.rights || []).length === 0 ? (
                            <p className="text-sm text-gray-400">{isHi ? "अभी कोई अधिकार जोड़ा नहीं गया" : "No rights added yet"}</p>
                          ) : (
                            sub.rights.map((right: any) => (
                              <div key={right.id} className="bg-gray-50 rounded-lg p-4">
                                <button onClick={() => toggleRight(right.id)} className="w-full text-left">
                                  <div className="flex items-center gap-2">
                                    <Scale className="w-4 h-4 text-saffron-500" />
                                    <h4 className="font-semibold text-gray-900">{isHi ? right.titleHi : right.title}</h4>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{isHi ? right.descriptionHi : right.description}</p>
                                </button>

                                {expandedRight.has(right.id) && (
                                  <div className="mt-4 space-y-3 text-sm border-t pt-3">
                                    <div>
                                      <div className="flex items-center gap-1 font-medium text-gray-700 mb-1">
                                        <BookOpen className="w-3.5 h-3.5" /> {t(language, "rightsLaw")}:
                                      </div>
                                      <p className="text-gray-600 bg-white p-2 rounded">{right.applicableLaw}</p>
                                    </div>

                                    {right.protections?.length > 0 && (
                                      <div>
                                        <p className="font-medium text-gray-700 mb-1">{t(language, "rightsProtections")}:</p>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                          {(isHi ? right.protectionsHi : right.protections).map((p: string, i: number) => <li key={i}>{p}</li>)}
                                        </ul>
                                      </div>
                                    )}

                                    {right.remedies?.length > 0 && (
                                      <div>
                                        <p className="font-medium text-gray-700 mb-1">{t(language, "rightsRemedies")}:</p>
                                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                                          {(isHi ? right.remediesHi : right.remedies).map((r: string, i: number) => <li key={i}>{r}</li>)}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
