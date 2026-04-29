const express = require("express");
const app = express();

app.use(express.json());

let donations = [];
const processedIds = new Set();

console.log("🔥 SERVER SOCIABUZZ FINAL AKTIF");

// ============================
// ROOT TEST
// ============================
app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

// ============================
// WEBHOOK SOCIABUZZ
// ============================
app.post("/webhook", (req, res) => {
    try {
        const body = req.body || {};

        console.log("📦 RAW:");
        console.log(JSON.stringify(body, null, 2));

        // 🔥 HANDLE SEMUA FORMAT
        const data = body.data || body;

        // 🔥 ID UNIK (PENTING)
        const id =
            data.transaction_id ||
            data.id ||
            Date.now().toString();

        // 🔥 ANTI DUPLICATE
        if (processedIds.has(id)) {
            console.log("⚠️ DUPLICATE DIABAIKAN:", id);
            return res.send("OK");
        }
        processedIds.add(id);

        // 🔥 NAMA DONATOR (SUPPORT SEMUA FORMAT)
        const donator =
            data.supporter ||          // ✅ FORMAT LO SEKARANG
            data.supporter_name ||     // ✅ FORMAT SOCIABUZZ
            data.donator_name ||
            data.name ||
            "Anonymous";

        // 🔥 AMOUNT
        const amount =
            Number(data.amount) ||
            Number(data.amount_raw) ||
            0;

        // 🔥 MESSAGE
        const message = data.message || "";

        const donation = {
            id: id,
            donator: donator,
            amount: amount,
            message: message,
            time: Date.now()
        };

        donations.push(donation);

        // 🔥 LIMIT DATA (BIAR GA BERAT)
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

// ============================
// GET UNTUK ROBLOX
// ============================
app.get("/donations", (req, res) => {
    res.json(donations);
});

// ============================
// START SERVER (RAILWAY)
// ============================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 SERVER RUNNING DI PORT " + PORT);
});
