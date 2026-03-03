"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { plansApi } from "@/lib/api";
import { t } from "@/lib/i18n";
import {
  MapPin, FileText, IndianRupee, Clock, BookOpen, CheckCircle2, Circle,
  Loader2, AlertTriangle, Building2, ChevronDown, ChevronUp,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";

export default function PlanPage() {
  const params = useParams();
  const issueId = params.id as string;
  const { language } = useAppStore();
  const isHi = language === "hi";
  const queryClient = useQueryClient();
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const { data: issue, isLoading, error } = useQuery({
    queryKey: ["issue", issueId],
    queryFn: () => plansApi.getByIssue(issueId).then((r) => r.data),
  });

  const stepMutation = useMutation({
    mutationFn: ({ stepId, status }: { stepId: string; status: string }) => plansApi.updateStep(stepId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["issue", issueId] }),
  });

  function toggleExpand(stepId: string) {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  }

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-navy-500" /></div>;
  if (error) return <div className="max-w-3xl mx-auto px-4 py-10"><div className="p-4 bg-red-50 text-red-700 rounded-lg">{t(language, "error")}</div></div>;
  if (!issue) return null;

  const shortTermPlan = issue.actionPlans?.find((p: any) => p.planType === "SHORT_TERM");
  const longTermPlan = issue.actionPlans?.find((p: any) => p.planType === "LONG_TERM");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">{t(language, "planTitle")}</h1>
        <div className="card bg-gray-50">
          <p className="text-sm text-gray-500 mb-1">{issue.category} {issue.subCategory ? `› ${issue.subCategory}` : ""}</p>
          <p className="text-gray-700">{issue.description}</p>
          <p className="text-xs text-gray-400 mt-2">{issue.state}, {issue.district}</p>
        </div>
      </div>

      {/* Plans */}
      {[
        { plan: shortTermPlan, label: t(language, "planShortTerm"), color: "saffron" },
        { plan: longTermPlan, label: t(language, "planLongTerm"), color: "forest" },
      ].map(({ plan, label, color }) => {
        if (!plan) return null;
        return (
          <div key={plan.id} className="mb-10">
            <h2 className={clsx("text-xl font-bold mb-2", color === "saffron" ? "text-saffron-700" : "text-forest-700")}>
              {label}
            </h2>
            <p className="text-gray-600 mb-6">{plan.summary}</p>

            <div className="space-y-4">
              {(plan.steps || []).map((step: any) => {
                const expanded = expandedSteps.has(step.id);
                const isComplete = step.status === "COMPLETED";
                return (
                  <div key={step.id} className={clsx("card border-l-4", {
                    "border-l-green-500": isComplete,
                    "border-l-saffron-500": !isComplete && color === "saffron",
                    "border-l-forest-500": !isComplete && color === "forest",
                  })}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => stepMutation.mutate({ stepId: step.id, status: isComplete ? "PENDING" : "COMPLETED" })}
                        className="flex-shrink-0 mt-1" disabled={stepMutation.isPending}>
                        {isComplete
                          ? <CheckCircle2 className="w-6 h-6 text-green-500" />
                          : <Circle className="w-6 h-6 text-gray-300 hover:text-navy-400 transition-colors" />
                        }
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={clsx("font-semibold", isComplete && "line-through text-gray-400")}>
                            {t(language, "planStep")} {step.sequence}: {step.title}
                          </h3>
                          <button onClick={() => toggleExpand(step.id)} className="text-gray-400 hover:text-gray-600">
                            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>

                        {expanded && (
                          <div className="mt-4 space-y-3 text-sm">
                            {step.officeToVisit && (
                              <div className="flex items-start gap-2">
                                <Building2 className="w-4 h-4 text-navy-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-gray-700">{t(language, "planOffice")}:</span>
                                  <span className="ml-1 text-gray-600">{step.officeToVisit}</span>
                                  {step.officeAddress && <p className="text-xs text-gray-400">{step.officeAddress}</p>}
                                </div>
                              </div>
                            )}
                            {step.documentsNeeded?.length > 0 && (
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-navy-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <span className="font-medium text-gray-700">{t(language, "planDocuments")}:</span>
                                  <ul className="list-disc list-inside ml-1 text-gray-600">
                                    {step.documentsNeeded.map((d: string, i: number) => <li key={i}>{d}</li>)}
                                  </ul>
                                </div>
                              </div>
                            )}
                            {step.estimatedCost && (
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-navy-500 flex-shrink-0" />
                                <span className="font-medium text-gray-700">{t(language, "planCost")}:</span>
                                <span className="text-gray-600">{step.estimatedCost}</span>
                              </div>
                            )}
                            {step.deadline && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-navy-500 flex-shrink-0" />
                                <span className="font-medium text-gray-700">{t(language, "planDeadline")}:</span>
                                <span className="text-gray-600">{step.deadline}</span>
                              </div>
                            )}
                            {step.legalReference && (
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-navy-500 flex-shrink-0" />
                                <span className="font-medium text-gray-700">{t(language, "planLaw")}:</span>
                                <span className="text-gray-600">{step.legalReference}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
