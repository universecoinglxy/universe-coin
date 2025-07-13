// api-server/index.js
const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// ✅ Tambahkan baris ini untuk menyajikan folder public
app.use(express.static("public"));

const ledgerPath = "./db/ledger.json";

// Init ledger
if (!fs.existsSync(ledgerPath)) {
    fs.writeFileSync(ledgerPath, JSON.stringify({
        wallets: {
            "admin": { balance: 1000000 }
        },
        transactions: []
    }, null, 2));
}

// Helper: load & save ledger
function loadLedger() {
    return JSON.parse(fs.readFileSync(ledgerPath));
}
function saveLedger(data) {
    fs.writeFileSync(ledgerPath, JSON.stringify(data, null, 2));
}

// GET /wallets - list all wallets
app.get("/wallets", (req, res) => {
    const data = loadLedger();
    res.json(data.wallets);
});

// POST /wallets - create wallet
app.post("/wallets", (req, res) => {
    const { address } = req.body;
    const data = loadLedger();
    if (data.wallets[address]) return res.status(400).json({ error: "Wallet exists." });
    data.wallets[address] = { balance: 0 };
    saveLedger(data);
    res.json({ message: "Wallet created", address });
});

// POST /tx - transfer UVR
app.post("/tx", (req, res) => {
    const { from, to, amount } = req.body;
    const data = loadLedger();
    if (!data.wallets[from] || !data.wallets[to]) return res.status(400).json({ error: "Invalid address" });
    if (data.wallets[from].balance < amount) return res.status(400).json({ error: "Insufficient balance" });
    data.wallets[from].balance -= amount;
    data.wallets[to].balance += amount;
    data.transactions.push({ from, to, amount, timestamp: Date.now() });
    saveLedger(data);
    res.json({ message: "Transaction successful" });
});

// GET /tx - list transactions
app.get("/tx", (req, res) => {
    const data = loadLedger();
    res.json(data.transactions);
});

app.listen(PORT, () => console.log(`🟢 UniverseCoin Testnet running on port ${PORT}`));
