"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import { categoriesApi, intakeApi, authApi } from "@/lib/api";
import { t } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, Loader2, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
import clsx from "clsx";

export default function IntakePageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-navy-500" /></div>}>
      <IntakeContent />
    </Suspense>
  );
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra",
  "Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
];

function IntakeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, token, setAuth } = useAppStore();
  const isHi = language === "hi";
  const presetCategory = searchParams.get("category");

  const [step, setStep] = useState(0); // 0: description, 1: questions, 2: location, 3: submitting
  const [category, setCategory] = useState(presetCategory || "");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [responses, setResponses] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [quickResult, setQuickResult] = useState<any>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list().then((r) => r.data),
  });

  const { data: questions } = useQuery({
    queryKey: ["questions", category],
    queryFn: () => categoriesApi.getQuestions(category).then((r) => r.data),
    enabled: !!category,
  });

  const analyzeMutation = useMutation({
    mutationFn: (text: string) => intakeApi.analyze(text, language),
    onSuccess: (res) => setQuickResult(res.data),
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => intakeApi.submit(data),
    onSuccess: (res) => {
      const issueId = res.data.issue.id;
      router.push(`/plan/${issueId}`);
    },
  });

  // Auto-guest login if no token
  useEffect(() => {
    if (!token) {
      authApi.guest().then((res) => setAuth(res.data.token, res.data.user));
    }
  }, [token, setAuth]);

  const selectedCat = (categories || []).find((c: any) => c.id === category);
  const questionList = questions || [];

  function handleAnswer(questionId: string, questionText: string, value: string, type: string) {
    const existing = responses.findIndex((r) => r.questionId === questionId);
    const entry = {
      questionId,
      questionText,
      responseText: type === "FREE_TEXT" ? value : null,
      responseOption: type !== "FREE_TEXT" ? value : null,
      sequence: currentQ + 1,
    };
    if (existing >= 0) {
      const copy = [...responses];
      copy[existing] = entry;
      setResponses(copy);
    } else {
      setResponses([...responses, entry]);
    }
  }

  function handleSubmit() {
    if (!category || !description || !state || !district) return;
    submitMutation.mutate({ category: selectedCat?.name || category, description, state, district, responses, language });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="section-title mb-8">{t(language, "intakeTitle")}</h1>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {["Category", "Questions", "Location", "Submit"].map((label, i) => (
          <div key={label} className={clsx("flex-1 h-2 rounded-full", step >= i ? "bg-navy-500" : "bg-gray-200")} />
        ))}
      </div>

      {/* Step 0: Category + Description */}
      {step === 0 && (
        <div className="space-y-6">
          {/* Category select */}
          {!presetCategory && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isHi ? "श्रेणी चुनें" : "Select Category"}
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field">
                <option value="">{t(language, "selectOne")}</option>
                {(categories || []).map((c: any) => (
                  <option key={c.id} value={c.id}>{isHi ? c.nameHi : c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t(language, "intakeDescLabel")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(language, "intakeDescPlaceholder")}
              className="input-field h-40 resize-none"
              dir={isHi ? "auto" : "ltr"}
            />
          </div>

          {/* Quick Analysis */}
          <button
            onClick={() => analyzeMutation.mutate(description)}
            disabled={description.length < 10 || analyzeMutation.isPending}
            className="btn-outline text-sm"
          >
            {analyzeMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {t(language, "intakeAnalyze")}
          </button>

          {quickResult && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Analysis
              </h3>
              <p className="text-sm text-blue-800 mb-2">{quickResult.summary}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={clsx("badge", {
                  "badge-urgency-low": quickResult.urgency === "LOW",
                  "badge-urgency-medium": quickResult.urgency === "MEDIUM",
                  "badge-urgency-high": quickResult.urgency === "HIGH",
                  "badge-urgency-critical": quickResult.urgency === "CRITICAL",
                })}>
                  {quickResult.urgency}
                </span>
                {quickResult.shouldSeekLawyer && (
                  <span className="badge bg-red-100 text-red-800 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {isHi ? "वकील से सलाह लें" : "Seek Lawyer"}
                  </span>
                )}
              </div>
              {quickResult.quickAdvice && (
                <p className="text-xs text-blue-700 mt-1">{quickResult.quickAdvice}</p>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={() => setStep(1)} disabled={!category || description.length < 10}
              className="btn-primary">
              {t(language, "intakeNext")} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Questions */}
      {step === 1 && (
        <div className="space-y-6">
          {questionList.length === 0 ? (
            <p className="text-gray-500">{t(language, "loading")}</p>
          ) : (
            <div className="card">
              {(() => {
                const q = questionList[currentQ];
                if (!q) return null;
                const answered = responses.find((r) => r.questionId === q.id);

                return (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">{currentQ + 1} / {questionList.length}</p>
                    <h3 className="text-lg font-semibold mb-4">{isHi ? q.questionTextHi : q.questionText}</h3>

                    {q.questionType === "FREE_TEXT" ? (
                      <textarea
                        value={answered?.responseText || ""}
                        onChange={(e) => handleAnswer(q.id, q.questionText, e.target.value, q.questionType)}
                        className="input-field h-32 resize-none"
                        dir={isHi ? "auto" : "ltr"}
                      />
                    ) : (
                      <div className="space-y-2">
                        {(isHi ? q.optionsHi : q.options).map((opt: string, i: number) => {
                          const val = q.options[i]; // always use English value for storage
                          const selected = answered?.responseOption === val;
                          return (
                            <button key={i} onClick={() => handleAnswer(q.id, q.questionText, val, q.questionType)}
                              className={clsx("w-full text-left px-4 py-3 rounded-lg border transition-colors", selected ? "bg-navy-50 border-navy-500 text-navy-700" : "border-gray-200 hover:border-gray-400")}
                            >
                              {selected && <CheckCircle className="w-4 h-4 inline mr-2 text-navy-500" />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          <div className="flex justify-between">
            <button onClick={() => currentQ > 0 ? setCurrentQ(currentQ - 1) : setStep(0)} className="btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t(language, "intakeBack")}
            </button>
            <button onClick={() => currentQ < questionList.length - 1 ? setCurrentQ(currentQ + 1) : setStep(2)} className="btn-primary">
              {t(language, "intakeNext")} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t(language, "intakeState")}</label>
            <select value={state} onChange={(e) => { setState(e.target.value); setDistrict(""); }} className="input-field">
              <option value="">{t(language, "selectOne")}</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t(language, "intakeDistrict")}</label>
            <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="input-field"
              placeholder={isHi ? "अपना जिला या शहर लिखें" : "Type your district or city"} />
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> {t(language, "intakeBack")}
            </button>
            <button onClick={handleSubmit} disabled={!state || !district || submitMutation.isPending} className="btn-saffron">
              {submitMutation.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
              {t(language, "intakeSubmit")}
            </button>
          </div>

          {submitMutation.isError && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
              {(submitMutation.error as any)?.response?.data?.error || t(language, "error")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
