import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { requireAuth, signToken, AuthRequest } from "../middleware/auth";

export const authRouter = Router();

// ── Register ────────────────────────────────
authRouter.post("/register", async (req, res) => {
  try {
    const { phone, email, name, password, language, state, district, pincode } = req.body;

    if (!phone && !email) return res.status(400).json({ error: "Phone or email required" });

    if (phone) {
      const existing = await prisma.user.findUnique({ where: { phone } });
      if (existing) return res.status(409).json({ error: "Phone already registered" });
    }
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: "Email already registered" });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : null;
    const user = await prisma.user.create({
      data: { phone, email, name, passwordHash, language: language || "hi", state, district, pincode },
    });

    const token = signToken({ id: user.id, role: user.role });
    res.status(201).json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, language: user.language } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Request OTP ─────────────────────────────
authRouter.post("/request-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone required" });

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone } });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.otpCode.create({
      data: { userId: user.id, code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    });

    // In production: send via SMS provider. For dev: log it.
    console.log(`📱 OTP for ${phone}: ${code}`);
    res.json({ message: "OTP sent", ...(process.env.NODE_ENV === "development" ? { otp: code } : {}) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Login (OTP or email+password) ───────────
authRouter.post("/login", async (req, res) => {
  try {
    const { phone, email, password, otp } = req.body;
    let user;

    if (phone && otp) {
      user = await prisma.user.findUnique({ where: { phone } });
      if (!user) return res.status(404).json({ error: "User not found" });

      const otpRecord = await prisma.otpCode.findFirst({
        where: { userId: user.id, code: otp, used: false, expiresAt: { gte: new Date() } },
        orderBy: { createdAt: "desc" },
      });
      if (!otpRecord) return res.status(401).json({ error: "Invalid or expired OTP" });

      await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });
      await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
    } else if (email && password) {
      user = await prisma.user.findUnique({ where: { email } });
      if (!user?.passwordHash) return res.status(401).json({ error: "Invalid credentials" });
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    } else {
      return res.status(400).json({ error: "Provide phone+otp or email+password" });
    }

    const token = signToken({ id: user.id, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role, language: user.language } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get profile ─────────────────────────────
authRouter.get("/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, phone: true, email: true, language: true, state: true, district: true, role: true, isVerified: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Guest token ─────────────────────────────
authRouter.post("/guest", (_req, res) => {
  const guestId = `guest-${Date.now()}`;
  const token = signToken({ id: guestId, role: "GUEST" });
  res.json({ token, user: { id: guestId, name: "Guest", role: "GUEST" } });
});
