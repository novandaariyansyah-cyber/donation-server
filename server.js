const express = require("express");
const app = express();

app.use(express.json({ limit: "1mb" }));

let donations = [];

// =============================
// ROOT
// =============================
app.get("/", (req, res) => {
    res.send("🚀 Sociabuzz server running");
});

// =============================
// ENDPOINT ROBLOX
// =============================
app.get("/donations", (req, res) => {
    res.json({
        status: "success",
        data: donations
    });
});

// =============================
// 🔥 WEBHOOK SOCIABUZZ (FIX UTAMA)
// =============================
app.post("/sociabuzz", (req, res) => {
    try {
        console.log("🔥 RAW BODY:", JSON.stringify(req.body, null, 2));

        // 🔥 FIX: ambil dari nested "data"
        const payload = req.body.data || req.body;

        const newDonation = {
            id: Date.now().toString(),

            // ✅ AMBIL NAMA YANG BENAR (STRUKTUR SOCIABUZZ)
            donator:
                payload.supporter_name ||
                payload.name ||
                payload.username ||
                "Anonymous",

            // ✅ NOMINAL
            amount:
                Number(payload.amount) ||
                Number(payload.amount_total) ||
                Number(payload.price) ||
                0,

            // ✅ PESAN
            message:
                payload.message ||
                payload.comment ||
                ""
        };

        donations.push(newDonation);

        if (donations.length > 50) {
            donations.shift();
        }

        console.log("✅ DONATION MASUK:", newDonation);

        res.sendStatus(200);
    } catch (err) {
        console.error("❌ ERROR:", err);
        res.sendStatus(500);
    }
});

// =============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server running on port", PORT);
});
