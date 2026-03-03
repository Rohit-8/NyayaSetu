"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { directoryApi } from "@/lib/api";
import { t } from "@/lib/i18n";
import { Search, MapPin, Phone, Clock, Building2, Filter } from "lucide-react";

export default function DirectoryPage() {
  const { language } = useAppStore();
  const isHi = language === "hi";

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: states } = useQuery({
    queryKey: ["dir-states"],
    queryFn: () => directoryApi.states().then((r) => r.data),
  });

  const { data: districts } = useQuery({
    queryKey: ["dir-districts", state],
    queryFn: () => directoryApi.districts(state).then((r) => r.data),
    enabled: !!state,
  });

  const { data: types } = useQuery({
    queryKey: ["dir-types"],
    queryFn: () => directoryApi.types().then((r) => r.data),
  });

  const params: Record<string, string> = { page: String(page), limit: "12" };
  if (state) params.state = state;
  if (district) params.district = district;
  if (type) params.type = type;
  if (search) params.search = search;

  const { data, isLoading } = useQuery({
    queryKey: ["offices", params],
    queryFn: () => directoryApi.offices(params).then((r) => r.data),
  });

  const offices = data?.offices || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="section-title mb-8">{t(language, "dirTitle")}</h1>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-gray-700">{isHi ? "फ़िल्टर" : "Filters"}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t(language, "dirSearch")} className="input-field pl-10" />
          </div>
          <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); setPage(1); }} className="input-field">
            <option value="">{t(language, "dirFilterState")}</option>
            {(states || []).map((s: string) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={district} onChange={(e) => { setDistrict(e.target.value); setPage(1); }} className="input-field" disabled={!state}>
            <option value="">{t(language, "dirFilterDistrict")}</option>
            {(districts || []).map((d: string) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="input-field">
            <option value="">{t(language, "dirFilterType")}</option>
            {(types || []).map((tp: string) => <option key={tp} value={tp}>{tp}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse"><div className="h-4 bg-gray-200 rounded w-3/4 mb-3" /><div className="h-3 bg-gray-100 rounded w-full mb-2" /><div className="h-3 bg-gray-100 rounded w-2/3" /></div>
          ))}
        </div>
      ) : offices.length === 0 ? (
        <div className="text-center py-16 text-gray-500">{t(language, "noResults")}</div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{pagination.total} {isHi ? "कार्यालय मिले" : "offices found"}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((office: any) => (
              <div key={office.id} className="card">
                <div className="flex items-start gap-3 mb-3">
                  <Building2 className="w-5 h-5 text-navy-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{isHi ? office.nameHi : office.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{office.officeType}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{isHi && office.addressHi ? office.addressHi : office.address}</span>
                  </div>
                  {office.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${office.phone}`} className="text-navy-500 hover:underline">{office.phone}</a>
                    </div>
                  )}
                  {office.officeHours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{office.officeHours}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.pages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded ${page === i + 1 ? "bg-navy-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
