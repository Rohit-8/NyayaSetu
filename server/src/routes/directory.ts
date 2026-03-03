import { Router } from "express";
import { prisma } from "../lib/prisma";

export const directoryRouter = Router();

// ── Search offices ───────────────────────────
directoryRouter.get("/offices", async (req, res) => {
  try {
    const { state, district, type, search, page = "1", limit = "20" } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (state) where.state = String(state);
    if (district) where.district = String(district);
    if (type) where.officeType = String(type);
    if (search) {
      where.OR = [
        { name: { contains: String(search), mode: "insensitive" } },
        { nameHi: { contains: String(search), mode: "insensitive" } },
        { address: { contains: String(search), mode: "insensitive" } },
      ];
    }

    const [offices, total] = await Promise.all([
      prisma.governmentOffice.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { name: "asc" },
      }),
      prisma.governmentOffice.count({ where }),
    ]);

    res.json({
      offices,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get unique states ────────────────────────
directoryRouter.get("/states", async (_req, res) => {
  try {
    const states = await prisma.governmentOffice.findMany({
      select: { state: true },
      distinct: ["state"],
      orderBy: { state: "asc" },
    });
    res.json(states.map((s) => s.state));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get districts for a state ────────────────
directoryRouter.get("/states/:state/districts", async (req, res) => {
  try {
    const districts = await prisma.governmentOffice.findMany({
      where: { state: req.params.state },
      select: { district: true },
      distinct: ["district"],
      orderBy: { district: "asc" },
    });
    res.json(districts.map((d) => d.district));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Office types  ────────────────────────────
directoryRouter.get("/types", async (_req, res) => {
  try {
    const types = await prisma.governmentOffice.findMany({
      select: { officeType: true },
      distinct: ["officeType"],
      orderBy: { officeType: "asc" },
    });
    res.json(types.map((t) => t.officeType));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
