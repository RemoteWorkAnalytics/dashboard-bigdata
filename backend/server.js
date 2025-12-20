const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());

const MONGO_URI = "mongodb://127.0.0.1:27017";

// 🟢 Databases
const DASHBOARD_DB = "employeeAnalyticsDB"; //عائشة
const ANALYTICS_DB = "analytics";            // سوزان

let dashboardDB;
let analyticsDB;

// 🔌 Connect once – use multiple DBs
MongoClient.connect(MONGO_URI)
  .then(client => {
    dashboardDB = client.db(DASHBOARD_DB);
    analyticsDB = client.db(ANALYTICS_DB);
    console.log("✅ Connected to MongoDB (multiple databases)");
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/* =========================
   Existing endpoint (DO NOT TOUCH)
   ========================= */
app.get('/api/stats', async (req, res) => {
  try {
    if (!dashboardDB)
      return res.status(500).json({ error: "Dashboard DB not initialized" });

    const stats = await dashboardDB
      .collection("cmsDashboard")
      .findOne({ _id: "live_counts" });

    if (!stats)
      return res.status(404).json({ message: "No live data found." });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   Your endpoint (analytics DB)
   ========================= */
app.get('/api/work-mode', async (req, res) => {
  try {
    if (!analyticsDB)
      return res.status(500).json({ error: "Analytics DB not initialized" });

    const data = await analyticsDB
      .collection("work_mode")
      .find({})
      .toArray();

    const chartData = data.map(d => ({
      location: d.workLocation,
      stressScore: d.employeesCount
    }));

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* =========================
   Work Location Impact (Spark Aggregation)
   ========================= */
app.get('/api/work-location-impact', async (req, res) => {
  try {
    if (!analyticsDB)
      return res.status(500).json({ error: "Analytics DB not initialized" });

    const data = await analyticsDB
      .collection("worklocation_impact")
      .find({})
      .sort({ workLocation: 1 })
      .toArray();

    // Transform for charts
    const chartData = data.map(d => ({
      workLocation: d.workLocation,
      totalEmployees: Number(d.totalEmployees),
      avgStress: d.avgStress,
      overallWellbeing: d.overallWellbeing,
      remoteEffectiveness: d.remoteEffectiveness
    }));

    res.json(chartData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
