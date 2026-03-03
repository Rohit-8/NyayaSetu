import { Router } from "express";
import { prisma } from "../lib/prisma";

export const helplinesRouter = Router();

// ── List all helplines (optional category filter) ──
helplinesRouter.get("/", async (req, res) => {
  try {
    const { category, state } = req.query;
    const where: any = {};
    if (category) where.category = String(category);
    if (state) {
      where.OR = [{ isNational: true }, { state: String(state) }];
    }

    const helplines = await prisma.emergencyHelpline.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    res.json(helplines);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
