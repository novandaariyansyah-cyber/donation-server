const express = require("express");
const app = express();

app.use(express.json({ limit: "1mb" }));

// =============================
// STORAGE (sementara)
let donations = [];

// =============================
// ROOT CHECK
// =============================
app.get("/", (req, res) => {
    res.send("🚀 Sociabuzz webhook server RUNNING");
});

// =============================
// 🔥 ENDPOINT UNTUK ROBLOX
// =============================
app.get("/donations", (req, res) => {
    res.json({
        status: "success",
        data: donations
    });
});

// =============================
// 🔥 WEBHOOK SOCIABUZZ
// =============================
app.post("/sociabuzz", (req, res) => {
    try {
        const data = req.body;

        console.log("🔥 RAW SOCIABUZZ:", JSON.stringify(data, null, 2));

        const newDonation = {
            id: Date.now().toString(),

            // 🔥 FIX NAMA (ANTI ANONYMOUS)
            donator:
                data.supporter_name ||
                data.name ||
                data.username ||
                data.email ||
                "Anonymous",

            // 🔥 FIX NOMINAL
            amount:
                Number(data.amount) ||
                Number(data.amount_total) ||
                Number(data.price) ||
                Number(data.donation_amount) ||
                0,

            // 🔥 FIX MESSAGE
            message:
                data.message ||
                data.comment ||
                data.notes ||
                ""
        };

        donations.push(newDonation);

        // batasi biar gak overload
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
// OPTIONAL (kalau kamu masih pakai /webhook)
// =============================
app.post("/webhook", (req, res) => {
    console.log("🔥 WEBHOOK FALLBACK:", req.body);

    const data = req.body;

    const newDonation = {
        id: Date.now().toString(),
        donator: data.supporter_name || data.name || "Anonymous",
        amount: Number(data.amount) || 0,
        message: data.message || ""
    };

    donations.push(newDonation);

    res.sendStatus(200);
});

// =============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Server running on port", PORT);
});
