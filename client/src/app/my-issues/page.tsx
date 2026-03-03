"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { plansApi } from "@/lib/api";
import { t } from "@/lib/i18n";
import { FileText, ArrowRight, Loader2, Clock, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export default function MyIssuesPage() {
  const { language, user } = useAppStore();
  const isHi = language === "hi";

  const { data: issues, isLoading } = useQuery({
    queryKey: ["my-issues"],
    queryFn: () => plansApi.myIssues().then((r) => r.data),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {isHi ? "कृपया पहले लॉगिन करें" : "Please login first"}
        </h2>
        <Link href="/login" className="btn-primary mt-4 inline-flex">{t(language, "navLogin")}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="section-title mb-8">{t(language, "navMyIssues")}</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-navy-500" /></div>
      ) : (issues || []).length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">{isHi ? "अभी कोई मामला नहीं है" : "No issues yet"}</p>
          <Link href="/intake" className="btn-primary inline-flex">{t(language, "heroBtn")}</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {(issues || []).map((issue: any) => (
            <Link key={issue.id} href={`/plan/${issue.id}`}
              className="card flex items-center justify-between group cursor-pointer hover:border-navy-300">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-navy-600">{issue.category}</span>
                  {issue.subCategory && <span className="text-xs text-gray-400">› {issue.subCategory}</span>}
                  <span className={clsx("badge text-xs", issue.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600")}>
                    {issue.status === "ACTIVE" ? <><CheckCircle2 className="w-3 h-3 mr-1" /> Active</> : issue.status}
                  </span>
                </div>
                <p className="text-gray-700 line-clamp-2">{issue.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(issue.createdAt).toLocaleDateString()}</span>
                  <span>{issue.state}, {issue.district}</span>
                  <span>{issue.actionPlans?.length || 0} {isHi ? "योजनाएं" : "plans"}</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-navy-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
