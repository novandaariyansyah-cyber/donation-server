const express = require("express");
const app = express();

app.use(express.json({ limit: "1mb" }));

let donations = [];

// =============================
// GET → ROBLOX (WAJIB FORMAT INI)
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

        console.log("🔥 RAW SOCIABUZZ:", data);

        // ⚠️ Mapping fleksibel (karena field Sociabuzz bisa beda-beda)
        const newDonation = {
            id: Date.now().toString(),

            // nama donatur
            donator:
                data.name ||
                data.username ||
                data.supporter_name ||
                "Anonymous",

            // nominal
            amount:
                Number(data.amount) ||
                Number(data.amount_total) ||
                Number(data.price) ||
                0,

            // pesan
            message:
                data.message ||
                data.comment ||
                ""
        };

        donations.push(newDonation);

        // limit biar ringan
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
app.get("/", (req, res) => {
    res.send("🚀 Sociabuzz webhook ready");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
