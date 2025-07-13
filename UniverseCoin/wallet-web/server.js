// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public")); // Simpan wallet atau explorer di folder public

app.get("/", (req, res) => {
  res.send("Universe Coin Wallet / Explorer Online!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
