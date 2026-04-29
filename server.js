const express = require("express");
const app = express();

app.use(express.json());

let donations = [];
const processedIds = new Set();

console.log("🔥 SERVER SOCIABUZZ (NO ANONYMOUS) AKTIF");

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

        const data = body.data || body;

        // 🚨 WAJIB ADA FIELD INI
        if (!data.supporter_name || !data.amount) {
            console.log("⚠️ DATA TIDAK VALID, DIABAIKAN");
            return res.send("OK");
        }

        // 🔥 ID UNIK
        const id =
            data.transaction_id ||
            data.id ||
            (data.supporter_name + "_" + Date.now());

        // 🔥 ANTI DUPLICATE
        if (processedIds.has(id)) {
            console.log("⚠️ DUPLICATE DIABAIKAN:", id);
            return res.send("OK");
        }
        processedIds.add(id);

        // 🔥 DATA FINAL (TANPA ANONYMOUS)
        const donation = {
            id: id,
            donator: data.supporter_name,
            amount: Number(data.amount),
            message: data.message || "",
            time: Date.now()
        };

        donations.push(donation);

        // 🔥 LIMIT BIAR GA BERAT
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
// GET DATA UNTUK ROBLOX
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
