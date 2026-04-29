const express = require("express");
const app = express(); // 🔥 INI YANG KAMU KURANG

app.use(express.json({ limit: "1mb" }));

let donations = [];

// =============================
app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

// =============================
app.get("/donations", (req, res) => {
    res.json({
        status: "success",
        data: donations
    });
});

// =============================
app.post("/sociabuzz", (req, res) => {
    try {
        console.log("🔥 RAW:", JSON.stringify(req.body, null, 2));

        const data = req.body.data || req.body;

        const name = data.customer_name;

        // ❗ skip kalau tidak ada nama
        if (!name || name.trim() === "") {
            console.log("⛔ SKIP: tidak ada nama");
            return res.sendStatus(200);
        }

        const newDonation = {
            id: Date.now().toString(),
            donator: name,
            amount: Number(data.amount) || 0,
            message: data.message || data.product_name || ""
        };

        donations.push(newDonation);

        console.log("✅ FINAL:", newDonation);

        res.sendStatus(200);
    } catch (err) {
        console.error("❌ ERROR:", err);
        res.sendStatus(500);
    }
});

// =============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 RUNNING ON PORT", PORT);
});
