const express = require("express");
const app = express();

app.use(express.json());

let donations = [];

// 🔥 WEBHOOK SOCIABUZZ
app.post("/webhook", (req, res) => {
    const data = req.body;

    const donation = {
        id: data.id || Date.now().toString(),
        donator: data.donator_name || data.name || "Anonymous",
        amount: data.amount_raw || data.amount || 0,
        message: data.message || "",
        time: Date.now() // 🔥 INI YANG JADI UNIQUE
    };

    // ❌ HAPUS CHECK DUPLICATE
    // langsung push aja
    donations.push(donation);

    console.log("🔥 DONASI MASUK:", donation);

    res.json({ status: "ok" });
});

// 🔥 ROBLOX AMBIL
app.get("/donations", (req, res) => {
    res.json(donations);
});

app.listen(3000, () => {
    console.log("🚀 Server running");
});