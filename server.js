const express = require("express");
const app = express();

app.use(express.json());

let donations = [];
const processedIds = new Set();

console.log("🔥 SERVER CONVERTER AKTIF");

// ============================
// ROOT
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
        const data = body.data || body;

        console.log("📦 RAW:", JSON.stringify(body, null, 2));

        // 🔥 AMBIL DATA SOCIABUZZ
        const name = data.supporter_name || data.supporter;
        const amount = Number(data.amount || data.amount_raw);
        const message = data.message || "";

        // ❌ JANGAN PROSES JIKA TIDAK VALID
        if (!name || !amount) {
            console.log("⚠️ DATA INVALID");
            return res.send("OK");
        }

        // 🔥 ID UNIK
        const id =
            data.transaction_id ||
            name + "_" + Date.now();

        // 🔥 ANTI DUPLICATE
        if (processedIds.has(id)) {
            console.log("⚠️ DUPLICATE:", id);
            return res.send("OK");
        }
        processedIds.add(id);

        // 🔥 FORMAT INTERNAL
        const donation = {
            id: id,
            donator: name,
            amount: amount,
            message: message
        };

        donations.push(donation);

        // limit data
        if (donations.length > 100) {
            donations.shift();
        }

        console.log("🔥 DONASI:", donation);

        res.send("OK");

    } catch (err) {
        console.error("❌ ERROR:", err);
        res.send("OK");
    }
});

// ============================
// 🔥 OUTPUT KE ROBLOX (FORMAT LAMA)
// ============================
app.get("/donations", (req, res) => {
    res.json({
        status: "success",
        data: donations
    });
});

// ============================
// START
// ============================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
    console.log("🚀 RUNNING PORT " + PORT);
});
