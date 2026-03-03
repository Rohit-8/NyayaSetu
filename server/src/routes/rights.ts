import { Router } from "express";
import { prisma } from "../lib/prisma";

export const rightsRouter = Router();

// ── Rights by subcategory ────────────────────
rightsRouter.get("/subcategory/:subCategoryId", async (req, res) => {
  try {
    const rights = await prisma.legalRight.findMany({
      where: { subCategoryId: req.params.subCategoryId },
      orderBy: { sortOrder: "asc" },
      include: {
        subCategory: {
          select: { id: true, name: true, nameHi: true, category: { select: { id: true, name: true, nameHi: true } } },
        },
      },
    });
    res.json(rights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── All rights grouped by category ───────────
rightsRouter.get("/", async (_req, res) => {
  try {
    const categories = await prisma.legalCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        subCategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: {
            rights: { orderBy: { sortOrder: "asc" } },
          },
        },
      },
    });
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
