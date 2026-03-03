import { Router } from "express";
import { prisma } from "../lib/prisma";
import { optionalAuth, AuthRequest } from "../middleware/auth";
import { classifyIssue, generateActionPlan, analyzeIssueText } from "../services/ai";

export const intakeRouter = Router();

// ── Submit full intake → classify + generate plans ──
intakeRouter.post("/submit", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { category, subCategory, description, state, district, responses, language } = req.body;
    if (!category || !description || !state || !district) {
      return res.status(400).json({ error: "category, description, state, district are required" });
    }

    // Resolve userId: use real DB user if exists, otherwise null
    let userId: string | null = null;
    if (req.user?.id) {
      const dbUser = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (dbUser) userId = dbUser.id;
    }

    // 1. AI classification
    const classification = await classifyIssue({ category, description, responses: responses || [], language: language || "en" });

    // 2. Save issue
    const issue = await prisma.legalIssue.create({
      data: {
        userId,
        category,
        subCategory: classification.subCategory || subCategory || null,
        description,
        confidence: classification.confidence,
        state,
        district,
        intakeResponses: {
          create: (responses || []).map((r: any) => ({
            questionId: r.questionId,
            questionText: r.questionText,
            responseText: r.responseText || null,
            responseOption: r.responseOption || null,
            sequence: r.sequence,
          })),
        },
      },
    });

    // 3. Generate action plans
    const plans = await generateActionPlan({
      category,
      subCategory: classification.subCategory || subCategory || "",
      description,
      state,
      district,
      responses: responses || [],
      language: language || "en",
      classification,
    });

    // 4. Store plans
    const shortTermPlan = await prisma.actionPlan.create({
      data: {
        issueId: issue.id,
        planType: "SHORT_TERM",
        summary: plans.shortTerm.summary,
        steps: {
          create: plans.shortTerm.steps.map((s: any, i: number) => ({
            sequence: i + 1,
            title: s.title,
            description: s.description,
            officeToVisit: s.officeToVisit || null,
            officeAddress: s.officeAddress || null,
            documentsNeeded: s.documentsNeeded || [],
            estimatedCost: s.estimatedCost || null,
            deadline: s.deadline || null,
            legalReference: s.legalReference || null,
          })),
        },
      },
      include: { steps: { orderBy: { sequence: "asc" } } },
    });

    const longTermPlan = await prisma.actionPlan.create({
      data: {
        issueId: issue.id,
        planType: "LONG_TERM",
        summary: plans.longTerm.summary,
        steps: {
          create: plans.longTerm.steps.map((s: any, i: number) => ({
            sequence: i + 1,
            title: s.title,
            description: s.description,
            officeToVisit: s.officeToVisit || null,
            officeAddress: s.officeAddress || null,
            documentsNeeded: s.documentsNeeded || [],
            estimatedCost: s.estimatedCost || null,
            deadline: s.deadline || null,
            legalReference: s.legalReference || null,
          })),
        },
      },
      include: { steps: { orderBy: { sequence: "asc" } } },
    });

    res.status(201).json({
      issue: { id: issue.id, category: issue.category, subCategory: issue.subCategory, classification },
      plans: { shortTerm: shortTermPlan, longTerm: longTermPlan },
    });
  } catch (err: any) {
    console.error("Intake error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── Free-text analysis (chat-style) ─────────
intakeRouter.post("/analyze", async (req, res) => {
  try {
    const { text, language } = req.body;
    if (!text || text.length < 5) {
      return res.status(400).json({ error: "Please describe your issue in more detail" });
    }
    const result = await analyzeIssueText(text, language || "en");
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
