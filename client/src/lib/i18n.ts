export const translations = {
  en: {
    // Navbar
    brand: "NyayaSetu",
    brandSub: "Your Bridge to Justice",
    navHome: "Home",
    navRights: "Know Your Rights",
    navDirectory: "Find Offices",
    navHelplines: "Helplines",
    navMyIssues: "My Issues",
    navLogin: "Login",
    navLogout: "Logout",
    langToggle: "हिंदी",
    emergency: "Emergency: 112",

    // Home
    heroTitle: "Navigate India's Legal System with Confidence",
    heroSubtitle: "AI-powered guidance to help you understand your rights, find the right offices, and get a step-by-step action plan — in Hindi and English.",
    heroBtn: "Describe Your Issue",
    heroBtnAlt: "Browse Categories",
    categoriesTitle: "What legal issue are you facing?",
    categoriesSubtitle: "Select a category to get started with personalized guidance",

    // Intake
    intakeTitle: "Tell Us About Your Issue",
    intakeDescLabel: "Describe your situation",
    intakeDescPlaceholder: "Explain what happened and what kind of help you need...",
    intakeState: "State",
    intakeDistrict: "District / City",
    intakeSubmit: "Get My Action Plan",
    intakeAnalyze: "Quick AI Analysis",
    intakeBack: "Back",
    intakeNext: "Next",

    // Plans
    planTitle: "Your Action Plan",
    planShortTerm: "Short-Term (7-14 days)",
    planLongTerm: "Long-Term (1-6 months)",
    planStep: "Step",
    planDocuments: "Documents Needed",
    planCost: "Estimated Cost",
    planDeadline: "Deadline",
    planLaw: "Legal Reference",
    planOffice: "Office to Visit",
    planMarkDone: "Mark Complete",
    planStatus: "Status",

    // Directory
    dirTitle: "Find Government Offices",
    dirSearch: "Search offices...",
    dirFilterState: "Select State",
    dirFilterDistrict: "Select District",
    dirFilterType: "Office Type",
    dirPhone: "Phone",
    dirHours: "Hours",

    // Rights
    rightsTitle: "Know Your Rights",
    rightsProtections: "Protections",
    rightsRemedies: "Remedies",
    rightsLaw: "Applicable Law",

    // Helplines
    helplinesTitle: "Emergency Helplines",
    helplinesCall: "Call Now",
    helplinesFree: "Toll Free",

    // Common
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try Again",
    noResults: "No results found",
    selectOne: "Select one",
  },

  hi: {
    // Navbar
    brand: "न्यायसेतु",
    brandSub: "न्याय का सेतु",
    navHome: "होम",
    navRights: "अपने अधिकार जानें",
    navDirectory: "कार्यालय खोजें",
    navHelplines: "हेल्पलाइन",
    navMyIssues: "मेरे मामले",
    navLogin: "लॉगिन",
    navLogout: "लॉगआउट",
    langToggle: "English",
    emergency: "आपातकालीन: 112",

    // Home
    heroTitle: "भारत की कानूनी व्यवस्था को आत्मविश्वास से समझें",
    heroSubtitle: "AI-संचालित मार्गदर्शन जो आपको अपने अधिकारों को समझने, सही कार्यालय खोजने, और चरण-दर-चरण कार्य योजना प्राप्त करने में मदद करता है।",
    heroBtn: "अपनी समस्या बताएं",
    heroBtnAlt: "श्रेणियां देखें",
    categoriesTitle: "आपको किस कानूनी समस्या का सामना है?",
    categoriesSubtitle: "व्यक्तिगत मार्गदर्शन शुरू करने के लिए एक श्रेणी चुनें",

    // Intake
    intakeTitle: "अपनी समस्या बताएं",
    intakeDescLabel: "अपनी स्थिति का वर्णन करें",
    intakeDescPlaceholder: "बताएं कि क्या हुआ और आपको किस तरह की मदद चाहिए...",
    intakeState: "राज्य",
    intakeDistrict: "जिला / शहर",
    intakeSubmit: "मेरी कार्य योजना प्राप्त करें",
    intakeAnalyze: "त्वरित AI विश्लेषण",
    intakeBack: "पीछे",
    intakeNext: "आगे",

    // Plans
    planTitle: "आपकी कार्य योजना",
    planShortTerm: "अल्पकालिक (7-14 दिन)",
    planLongTerm: "दीर्घकालिक (1-6 महीने)",
    planStep: "चरण",
    planDocuments: "आवश्यक दस्तावेज़",
    planCost: "अनुमानित लागत",
    planDeadline: "समय सीमा",
    planLaw: "कानूनी संदर्भ",
    planOffice: "कार्यालय जाएं",
    planMarkDone: "पूर्ण चिह्नित करें",
    planStatus: "स्थिति",

    // Directory
    dirTitle: "सरकारी कार्यालय खोजें",
    dirSearch: "कार्यालय खोजें...",
    dirFilterState: "राज्य चुनें",
    dirFilterDistrict: "जिला चुनें",
    dirFilterType: "कार्यालय का प्रकार",
    dirPhone: "फ़ोन",
    dirHours: "समय",

    // Rights
    rightsTitle: "अपने अधिकार जानें",
    rightsProtections: "सुरक्षा",
    rightsRemedies: "उपचार",
    rightsLaw: "लागू कानून",

    // Helplines
    helplinesTitle: "आपातकालीन हेल्पलाइन",
    helplinesCall: "अभी कॉल करें",
    helplinesFree: "टोल फ्री",

    // Common
    loading: "लोड हो रहा है...",
    error: "कुछ गलत हो गया",
    retry: "पुनः प्रयास करें",
    noResults: "कोई परिणाम नहीं मिला",
    selectOne: "एक चुनें",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["en"];

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}
