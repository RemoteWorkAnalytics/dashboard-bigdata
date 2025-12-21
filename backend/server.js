const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());

const MONGO_URI = "mongodb://127.0.0.1:27017"; 
 
let dbEmployee;  
let dbAnalytics;  

 
MongoClient.connect(MONGO_URI)
  .then(client => {
    
    dbEmployee = client.db("employeeAnalyticsDB");
    dbAnalytics = client.db("analytics");

    console.log("✅ Connected to MongoDB Multi-DB System:");
    console.log("   - [employeeAnalyticsDB] initialized for Stats");
    console.log("   - [analytics] initialized for Alerts");
  })
  .catch(err => console.error("  MongoDB Connection Error:", err));

 
app.get('/api/stats', async (req, res) => {
  try {
    if (!dbEmployee) return res.status(500).json({ error: "Employee DB not initialized" });

    const stats = await dbEmployee.collection("cmsDashboard").findOne({ _id: "live_counts" });
    
    if (!stats) return res.status(404).json({ message: "No live stats found." });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
app.get('/api/alerts', async (req, res) => {
  try {
    if (!dbAnalytics) return res.status(500).json({ error: "Analytics DB not initialized" });

    const alerts = await dbAnalytics.collection("dept_burnout_alerts")
      .find()
      .sort({ alertTimestamp: -1 }) 
      .toArray();

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`  API Gateway ready at http://localhost:${PORT}`);
  console.log(`  Stats Endpoint: http://localhost:${PORT}/api/stats`);
  console.log(`  Alerts Endpoint: http://localhost:${PORT}/api/alerts`);
});