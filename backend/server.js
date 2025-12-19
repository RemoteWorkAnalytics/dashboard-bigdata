const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
 
app.use(cors());

const MONGO_URI = "mongodb://127.0.0.1:27017"; 
const DB_NAME = "employeeAnalyticsDB";
let db;

 
MongoClient.connect(MONGO_URI)
  .then(client => {
    db = client.db(DB_NAME);
    console.log("  Connected to MongoDB: Listening for Dashboard updates");
  })
  .catch(err => console.error("  MongoDB Connection Error:", err));

 
app.get('/api/stats', async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: "Database not initialized" });

    const stats = await db.collection("cmsDashboard").findOne({ _id: "live_counts" });
    
    if (!stats) {
        return res.status(404).json({ message: "No live data found. Ensure Spark app is running." });
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`  API Server ready at http://localhost:${PORT}/api/stats`);
});