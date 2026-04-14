const express = require("express");
const app = express();

app.use(express.json());

let donations = [];

// 🔥 WEBHOOK DARI SOCIABUZZ
app.post("/webhook", (req, res) => {
    const data = req.body;

    const donation = {
        id: data.id || Date.now().toString(),
        donator: data.donator_name || data.name || "Anonymous",
        amount: data.amount_raw || data.amount || 0,
        message: data.message || "",
        time: Date.now()
    };

    donations.push(donation);

    console.log("🔥 DONASI MASUK:", donation);

    res.send("OK");
});

// 🔥 ROBLOX AMBIL DATA
app.get("/donations", (req, res) => {
    res.json(donations);
});

// 🔥 CLEAR (opsional biar gak numpuk)
app.get("/clear", (req, res) => {
    donations = [];
    res.send("CLEARED");
});

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});s