const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());

const MONGO_URI = "mongodb://127.0.0.1:27017";

// 🟢 Databases
const ANALYTICS_DB = "analytics";            // Spark analytics


let analyticsDB;

// 🔌 Connect once – multiple databases
MongoClient.connect(MONGO_URI)
  .then(client => {
    analyticsDB = client.db(ANALYTICS_DB);
    console.log("✅ Connected to MongoDB (multiple databases)");
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

/* =========================
   Existing endpoint (Dashboard)
   ========================= */
app.get('/api/stats', async (req, res) => {
  try {
    if (!analyticsDB)
      return res.status(500).json({ error: "Dashboard DB not initialized" });

    const stats = await analyticsDB
      .collection("cmsDashboard")
      .findOne({ _id: "live_counts" });ى

    if (!stats)
      return res.status(404).json({ message: "No live data found." });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   Work Mode (Spark Aggregation)
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
   Work Location Impact
   ========================= */
app.get('/api/work-location-impact', async (req, res) => {
  try {
    if (!analyticsDB) return res.status(500).json({ error: "Analytics DB not initialized" });

    // التصحيح: القراءة من collection "work_mode" كما في الصورة
    const data = await analyticsDB
      .collection("work_mode") 
      .find({})
      .sort({ workLocation: 1 })
      .toArray();

    // نرسل البيانات كما هي لضمان وصول كافة الحقول (Access, Stress, Productivity)
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/alerts', async (req, res) => {
  try {
    if (!analyticsDB) return res.status(500).json({ error: "Analytics DB not initialized" });

    const alerts = await analyticsDB.collection("dept_burnout_alerts")
      .find()
      .sort({ alertTimestamp: -1 }) 
      .toArray();

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* =========================
   Access Impact (With / Without Access)
   ========================= */
app.get('/api/access-impact', async (req, res) => {
  try {
    if (!analyticsDB)
      return res.status(500).json({ error: "Analytics DB not initialized" });

    // ناخد Remote كمثال (زي داتا زميلتك)
    const data = await analyticsDB
      .collection("worklocation_impact")
      .findOne({ workLocation: "Remote" });

    if (!data)
      return res.status(404).json({ message: "No data found" });

    res.json({
      employeesWithAccess: Number(data.employeesWithAccess),
      percentWithAccess: Number(data.percentWithAccess),

      avgStressWithAccess: Number(data.avgStressWithAccess),
      avgStressWithoutAccess: Number(data.avgStressWithoutAccess),

      avgProductivityWithAccess: Number(data.avgProductivityWithAccess),
      avgProductivityWithoutAccess: Number(data.avgProductivityWithoutAccess)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
});