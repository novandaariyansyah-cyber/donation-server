const express = require("express");
const app = express();

app.use(express.json());

let donations = [];

// ========================================
// 🔥 WEBHOOK DARI SOCIABUZZ
// ========================================
app.post("/webhook", (req, res) => {
    const data = req.body;

    const donation = {
        id: data.id || Date.now().toString(),
        donator: data.donator_name || data.name || "Anonymous",
        amount: data.amount_raw || data.amount || 0,
        message: data.message || "",
        time: Date.now() // 🔥 ini bikin setiap entry tetap unik
    };

    // ✅ LANGSUNG MASUKKAN (TANPA CEK DUPLICATE)
    donations.push(donation);

    console.log("🔥 DONASI MASUK:", donation);

    // ✅ RESPONSE WAJIB OK (BIAR SOCIABUZZ GAK ERROR)
    res.json({ status: "ok" });
});

// ========================================
// 🎮 ROBLOX AMBIL DATA
// ========================================
app.get("/donations", (req, res) => {
    res.json(donations);
});

// ========================================
// 🧹 AUTO CLEAR (OPSIONAL)
// ========================================
setInterval(() => {
    if (donations.length > 100) {
        donations = donations.slice(-50); // simpan 50 terakhir
        console.log("🧹 AUTO CLEAR DATA");
    }
}, 60000); // tiap 1 menit

// ========================================
app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

// ========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
});