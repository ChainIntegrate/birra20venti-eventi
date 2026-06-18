require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/registrazione", require("./routes/registrazione"));

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "online" });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`\n🍺 Birra20Venti Server`);
  console.log(`   API: http://localhost:${PORT}/api`);
});