import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { organizeRouter } from "./routes/organize.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, apiKeyConfigured: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.use("/api/organize", organizeRouter);

// In production, serve the built client (npm run build at the repo root
// builds client/dist) so the whole app runs from a single server/port.
const clientDist = path.join(__dirname, "../../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Note organizer API listening on http://localhost:${PORT}`);
});
