import { Router } from "express";
import { prisma } from "../lib/prisma";

export const categoriesRouter = Router();

// ── Get all legal categories ────────────────
categoriesRouter.get("/", async (_req, res) => {
  try {
    const categories = await prisma.legalCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        subCategories: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      },
    });

    const result = categories.map((c) => ({
      id: c.id,
      name: c.name,
      nameHi: c.nameHi,
      description: c.description,
      descriptionHi: c.descriptionHi,
      icon: c.icon,
      subCategories: c.subCategories.map((s) => ({
        id: s.id,
        name: s.name,
        nameHi: s.nameHi,
        description: s.description,
        descriptionHi: s.descriptionHi,
        applicableLaws: s.applicableLaws,
      })),
    }));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get intake questions for a category ─────
categoriesRouter.get("/:categoryId/questions", async (req, res) => {
  try {
    const questions = await prisma.intakeQuestion.findMany({
      where: { categoryId: req.params.categoryId },
      orderBy: { sequence: "asc" },
    });

    const result = questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionTextHi: q.questionTextHi,
      questionType: q.questionType,
      options: q.options,
      optionsHi: q.optionsHi,
      sequence: q.sequence,
      dependsOn: q.dependsOn,
      dependsOnValue: q.dependsOnValue,
      isRequired: q.isRequired,
    }));
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
