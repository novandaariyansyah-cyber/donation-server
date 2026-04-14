const express = require("express");
const app = express();

app.use(express.json());

let donations = [];

console.log("🔥 VERSION FINAL AKTIF");

// ========================================
// ROOT TEST
// ========================================
app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

// ========================================
// WEBHOOK DARI SOCIABUZZ
// ========================================
app.post("/webhook", (req, res) => {
    console.log("🔥 WEBHOOK MASUK");

    const data = req.body || {};

    const donation = {
        id: data.id || Date.now().toString(),
        donator: data.donator_name || data.name || "Anonymous",
        amount: Number(data.amount_raw || data.amount || 0),
        message: data.message || "",
        time: Date.now()
    };

    donations.push(donation);

    console.log("🔥 DONASI MASUK:", donation);

    // 🔥 WAJIB TEXT (BIAR GA DUPLICATE)
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("OK");
});

// ========================================
// ROBLOX AMBIL DATA
// ========================================
app.get("/donations", (req, res) => {
    res.json(donations);
});

// ========================================
// AUTO CLEAR (BIAR GA NUMPUK)
// ========================================
setInterval(() => {
    if (donations.length > 100) {
        donations = donations.slice(-50);
        console.log("🧹 AUTO CLEAR DATA");
    }
}, 60000);

// ========================================
// PORT FIX UNTUK RAILWAY
// ========================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 SERVER RUNNING DI PORT " + PORT);
});