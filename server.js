const express = require("express");
const app = express();

app.use(express.json());

let donations = [];

// ========================================
// 🔥 WEBHOOK DARI SOCIABUZZ
// ========================================
app.post("/webhook", (req, res) => {
    try {
        const data = req.body || {};

        const donation = {
            id: data.id || Date.now().toString(),
            donator: data.donator_name || data.name || "Anonymous",
            amount: Number(data.amount_raw || data.amount || 0),
            message: data.message || "",
            time: Date.now() // 🔥 UNIQUE TIME
        };

        // ✅ TIDAK ADA DUPLICATE CHECK
        donations.push(donation);

        console.log("🔥 DONASI MASUK:", donation);

        // 🔥 PENTING: HARUS TEXT, BUKAN JSON
        res.setHeader("Content-Type", "text/plain");
        res.status(200).send("OK");

    } catch (err) {
        console.error("❌ ERROR:", err);

        res.setHeader("Content-Type", "text/plain");
        res.status(200).send("OK"); // tetap OK biar Sociabuzz gak retry
    }
});

// ========================================
// 🎮 ROBLOX AMBIL DATA
// ========================================
app.get("/donations", (req, res) => {
    res.json(donations);
});

// ========================================
// 🧹 AUTO CLEAR (BIAR GAK NUMPUK)
// ========================================
setInterval(() => {
    if (donations.length > 100) {
        donations = donations.slice(-50);
        console.log("🧹 AUTO CLEAR DATA");
    }
}, 60000);

// ========================================
app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

// ========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});