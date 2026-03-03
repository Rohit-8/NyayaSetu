import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "sk-placeholder" });
const MODEL = "gpt-4o-mini";

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────
interface ClassifyInput {
  category: string;
  description: string;
  responses: { questionText: string; responseText?: string; responseOption?: string }[];
  language: string;
}

interface ClassifyResult {
  subCategory: string;
  confidence: number;
  summary: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  applicableLaws: string[];
}

interface PlanInput {
  category: string;
  subCategory: string;
  description: string;
  state: string;
  district: string;
  responses: any[];
  language: string;
  classification: ClassifyResult;
}

interface ActionStep {
  title: string;
  description: string;
  officeToVisit?: string;
  officeAddress?: string;
  documentsNeeded?: string[];
  estimatedCost?: string;
  deadline?: string;
  legalReference?: string;
}

interface PlanResult {
  shortTerm: { summary: string; steps: ActionStep[] };
  longTerm: { summary: string; steps: ActionStep[] };
}

// ─────────────────────────────────────────────
//  CLASSIFY ISSUE
// ─────────────────────────────────────────────
export async function classifyIssue(input: ClassifyInput): Promise<ClassifyResult> {
  const responseSummary = input.responses
    .map((r) => `Q: ${r.questionText}\nA: ${r.responseText || r.responseOption || "N/A"}`)
    .join("\n\n");

  const prompt = `You are an expert Indian legal advisor AI. Classify the following legal issue.

Category: ${input.category}
Description: ${input.description}
${responseSummary ? `\nIntake responses:\n${responseSummary}` : ""}

Return ONLY valid JSON with these exact fields:
{
  "subCategory": "specific sub-category of the issue",
  "confidence": 0.0-1.0,
  "summary": "2-3 sentence summary of the issue",
  "urgency": "LOW|MEDIUM|HIGH|CRITICAL",
  "applicableLaws": ["list of Indian laws that may apply"]
}

Guidelines:
- Reference Indian statutes (IPC, CPC, CrPC, specific Acts)
- Consider state-specific provisions if identifiable
- Be conservative with confidence scores
- Assess urgency based on potential harm, deadlines (e.g., FIR filing within 24h for serious crimes)`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a legal classification AI for Indian law. Always respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.error("AI classification error:", err.message);
    return {
      subCategory: "General",
      confidence: 0.3,
      summary: `Issue related to ${input.category}: ${input.description.slice(0, 100)}`,
      urgency: "MEDIUM",
      applicableLaws: [],
    };
  }
}

// ─────────────────────────────────────────────
//  GENERATE ACTION PLAN
// ─────────────────────────────────────────────
export async function generateActionPlan(input: PlanInput): Promise<PlanResult> {
  const prompt = `You are an expert Indian legal advisor. Generate a comprehensive dual-horizon action plan.

Issue Details:
- Category: ${input.category}
- Sub-category: ${input.subCategory}
- Description: ${input.description}
- State: ${input.state}, District: ${input.district}
- Urgency: ${input.classification.urgency}
- Applicable laws: ${input.classification.applicableLaws.join(", ")}
- Summary: ${input.classification.summary}

Generate TWO action plans in JSON format:

{
  "shortTerm": {
    "summary": "What to do in the next 7-14 days",
    "steps": [
      {
        "title": "Step title",
        "description": "Detailed step description with specific instructions",
        "officeToVisit": "Name of office/authority (if applicable)",
        "officeAddress": "General location hint (e.g., District Court, ${input.district})",
        "documentsNeeded": ["list of required documents"],
        "estimatedCost": "Estimated fee in INR (if any)",
        "deadline": "Time-sensitivity note",
        "legalReference": "Section/Act reference"
      }
    ]
  },
  "longTerm": {
    "summary": "Steps for next 1-6 months for lasting resolution",
    "steps": [same structure as above]
  }
}

Guidelines:
- Short-term: 3-5 immediate practical steps (filing FIR, complaints, protective orders)
- Long-term: 3-6 strategic steps (court cases, appeals, documentation for future)
- Include specific government offices in ${input.state}
- Reference Indian legal provisions (IPC, CPC, CrPC, specific Acts)
- Mention free legal aid options (DLSA, NALSA) where applicable
- Include cost estimates in INR
- Be empathetic but precise
- Language: ${input.language === "hi" ? "Hindi" : "English"}`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a legal advisor AI for Indian law. Generate actionable, specific legal action plans. Respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 3000,
    });

    const text = completion.choices[0]?.message?.content || "{}";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.error("AI plan generation error:", err.message);
    return buildFallbackPlan(input);
  }
}

// ─────────────────────────────────────────────
//  ANALYZE FREE TEXT
// ─────────────────────────────────────────────
export async function analyzeIssueText(text: string, language: string) {
  const prompt = `You are an expert Indian legal advisor AI. A citizen described their situation:

"${text}"

Analyze this and return JSON:
{
  "suggestedCategory": "Most likely legal category",
  "suggestedSubCategory": "Specific sub-category",
  "urgency": "LOW|MEDIUM|HIGH|CRITICAL",
  "summary": "Brief empathetic summary of their situation",
  "quickAdvice": "2-3 immediate practical tips",
  "applicableLaws": ["relevant Indian laws"],
  "shouldSeekLawyer": true/false,
  "nextQuestions": ["follow-up questions to better understand the issue"]
}

Respond in ${language === "hi" ? "Hindi" : "English"}.`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a compassionate legal advisor AI for Indian citizens. Always respond with valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 1200,
    });

    const aiText = completion.choices[0]?.message?.content || "{}";
    const cleaned = aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.error("AI analysis error:", err.message);
    return {
      suggestedCategory: "General",
      suggestedSubCategory: "General Legal Query",
      urgency: "MEDIUM",
      summary: "We received your query. Please provide more details for better assistance.",
      quickAdvice: "Consider visiting your nearest Legal Aid Centre (DLSA) for free legal advice.",
      applicableLaws: [],
      shouldSeekLawyer: true,
      nextQuestions: ["Can you describe when this incident happened?", "Have you filed any complaint so far?"],
    };
  }
}

// ─────────────────────────────────────────────
//  FALLBACK PLAN (when AI fails)
// ─────────────────────────────────────────────
function buildFallbackPlan(input: PlanInput): PlanResult {
  return {
    shortTerm: {
      summary: `Immediate steps for your ${input.category} issue in ${input.district}, ${input.state}`,
      steps: [
        {
          title: "Document Everything",
          description: "Gather and organise all relevant documents, communications, and evidence related to your issue. Make photocopies of all originals.",
          documentsNeeded: ["ID proof (Aadhaar/Voter ID)", "Relevant documents related to the issue"],
          deadline: "Immediately",
        },
        {
          title: "Visit District Legal Services Authority (DLSA)",
          description: `Visit the DLSA office in ${input.district} for free legal aid. Under Section 12 of the Legal Services Authorities Act 1987, you may be entitled to free legal assistance.`,
          officeToVisit: `District Legal Services Authority, ${input.district}`,
          documentsNeeded: ["ID proof", "Income certificate (if applicable)", "Case-related documents"],
          estimatedCost: "Free",
          legalReference: "Legal Services Authorities Act, 1987",
        },
        {
          title: "File a Complaint/FIR if Criminal",
          description: "If the issue involves a criminal offence, visit the nearest police station to file an FIR. Under Section 154 CrPC, police must register your FIR.",
          officeToVisit: `Nearest Police Station, ${input.district}`,
          legalReference: "Section 154, CrPC",
        },
      ],
    },
    longTerm: {
      summary: `Long-term resolution plan for your ${input.category} issue`,
      steps: [
        {
          title: "Seek Legal Representation",
          description: "Consult a lawyer specialising in this area. If finances are a constraint, approach NALSA or your State Legal Services Authority for a panel lawyer.",
          estimatedCost: "Free under NALSA / ₹500-₹5,000 for private consultation",
          legalReference: "NALSA (Free and Competent Legal Services) Regulations, 2010",
        },
        {
          title: "File Appropriate Legal Proceedings",
          description: "Based on legal advice, file the appropriate case — civil suit, writ petition, or criminal complaint before the relevant court/forum.",
          officeToVisit: `District Court / Consumer Forum / Tribunal, ${input.district}`,
          documentsNeeded: ["All evidence", "Complaint/Petition draft", "Court fee stamps", "Vakalatnama"],
          estimatedCost: "Court fees vary by case value",
        },
        {
          title: "Follow Up and Track Progress",
          description: "Track case progress via eCourts (ecourts.gov.in). Attend all hearing dates. Keep your lawyer updated with any new developments.",
        },
      ],
    },
  };
}
