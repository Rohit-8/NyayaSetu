import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { categoriesRouter } from "./routes/categories";
import { intakeRouter } from "./routes/intake";
import { plansRouter } from "./routes/plans";
import { directoryRouter } from "./routes/directory";
import { rightsRouter } from "./routes/rights";
import { helplinesRouter } from "./routes/helplines";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ───────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());

// ── Health ───────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "nyayasetu-api", time: new Date().toISOString() });
});

// ── Routes ───────────────────────────────────
app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/intake", intakeRouter);
app.use("/api/plans", plansRouter);
app.use("/api/directory", directoryRouter);
app.use("/api/rights", rightsRouter);
app.use("/api/helplines", helplinesRouter);

// ── Error handler ────────────────────────────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 NyayaSetu API running at http://localhost:${PORT}`);
});

export default app;
