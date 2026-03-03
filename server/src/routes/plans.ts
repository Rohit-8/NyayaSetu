import { Router } from "express";
import { prisma } from "../lib/prisma";
import { optionalAuth, AuthRequest } from "../middleware/auth";

export const plansRouter = Router();

// ── Get plans for an issue ───────────────────
plansRouter.get("/issue/:issueId", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { issueId } = req.params;
    const issue = await prisma.legalIssue.findFirst({
      where: { id: issueId },
      include: {
        actionPlans: {
          include: { steps: { orderBy: { sequence: "asc" } } },
          orderBy: { createdAt: "asc" },
        },
        intakeResponses: { orderBy: { sequence: "asc" } },
      },
    });
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    res.json(issue);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── List all user issues ─────────────────────
plansRouter.get("/my-issues", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const issues = await prisma.legalIssue.findMany({
      where: req.user?.id ? { userId: req.user.id } : {},
      include: {
        actionPlans: {
          select: { id: true, planType: true, summary: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(issues);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get single plan detail ───────────────────
plansRouter.get("/:planId", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const plan = await prisma.actionPlan.findFirst({
      where: {
        id: req.params.planId,
      },
      include: {
        steps: { orderBy: { sequence: "asc" } },
        issue: { select: { id: true, category: true, subCategory: true, description: true, state: true, district: true } },
      },
    });
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    res.json(plan);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Mark step completed / in-progress ────────
plansRouter.patch("/step/:stepId", optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    if (!["PENDING", "IN_PROGRESS", "COMPLETED", "SKIPPED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const step = await prisma.actionStep.findUnique({
      where: { id: req.params.stepId },
    });
    if (!step) {
      return res.status(404).json({ error: "Step not found" });
    }

    const updated = await prisma.actionStep.update({
      where: { id: req.params.stepId },
      data: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
