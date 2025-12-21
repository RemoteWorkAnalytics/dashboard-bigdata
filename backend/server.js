const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "analytics";

let db;

/* =========================
   Mongo Connection
   ========================= */
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log("✅ Connected to MongoDB:", DB_NAME);
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/* =========================
   REAL-TIME STATS (Dashboard)
   Used by RealTimeStats.tsx
   ========================= */
app.get("/api/stats", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not initialized" });

    const stats = await db
      .collection("cmsDashboard")
      .findOne({ _id: "live_counts" });

    if (!stats) return res.status(404).json({ message: "No stats found" });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ALERTS
   ========================= */
app.get("/api/alerts", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not initialized" });

    const alerts = await db
      .collection("dept_burnout_alerts")
      .find()
      .sort({ alertTimestamp: -1 })
      .toArray();

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   WORK LOCATION IMPACT
   Used by:
   - WorkLocationImpact
   - WorkLocationDashboardd
   ========================= */
app.get("/api/work-location-impact", async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "DB not initialized" });

    const data = await db
      .collection("work_location_impact")
      .find({})
      .sort({ workLocation: 1 })
      .toArray();

    /*
      Expected document shape:
      {
        workLocation: "Remote",
        totalEmployees: 120,
        avgStress: 2.3,
        overallWellbeing: 3.8,
        remoteEffectiveness: 4.1
      }
    */

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   Server
   ========================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log("🚀 API Server running on http://localhost:" + PORT);
  console.log("   → /api/stats");
  console.log("   → /api/alerts");
  console.log("   → /api/work-location-impact");
});
