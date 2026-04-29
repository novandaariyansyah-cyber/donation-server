const express = require("express");
const app = express();

app.use(express.json());

let donations = [];
const processedIds = new Set();

console.log("🔥 SERVER SOCIABUZZ FINAL AKTIF");

// ========================================
// ROOT TEST
// ========================================
app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

// ========================================
// WEBHOOK SOCIABUZZ (FORMAT ASLI)
// ========================================
app.post("/webhook", (req, res) => {
    try {
        const body = req.body || {};

        console.log("📦 RAW:", JSON.stringify(body, null, 2));

        // 🔥 SUPPORT SEMUA FORMAT
        const data = body.data || body;

        const id =
            data.transaction_id ||   // Sociabuzz asli
            data.id ||               // fallback
            Date.now().toString();   // terakhir

        // 🔥 ANTI DUPLICATE
        if (processedIds.has(id)) {
            console.log("⚠️ DUPLICATE DIABAIKAN:", id);
            return res.send("OK");
        }
        processedIds.add(id);

        const donation = {
            id: id,
            donator:
                data.supporter_name ||
                data.donator_name ||
                data.name ||
                "Anonymous",
            amount: Number(
                data.amount ||
                data.amount_raw ||
                0
            ),
            message: data.message || "",
            time: Date.now()
        };

        donations.push(donation);

        // 🔥 LIMIT BIAR GA MEMBENGKAK
        if (donations.length > 200) {
            donations = donations.slice(-100);
        }

        console.log("🔥 DONASI MASUK:");
        console.log(JSON.stringify(donation, null, 2));

        res.send("OK");

    } catch (err) {
        console.error("❌ ERROR:", err);
        res.status(500).send("ERROR");
    }
});

// ========================================
// GET DATA UNTUK ROBLOX
// ========================================
app.get("/donations", (req, res) => {
    res.json(donations);
});

// ========================================
// START SERVER (WAJIB UNTUK RAILWAY)
// ========================================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 SERVER RUNNING DI PORT " + PORT);
});
