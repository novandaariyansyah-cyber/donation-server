const express = require("express");
const app = express();

app.use(express.json());

let donations = [];

console.log("🔥 VERSION FINAL AKTIF");

// WEBHOOK
app.post("/webhook", (req, res) => {
    console.log("🔥 WEBHOOK MASUK");

    const data = req.body || {};

    const donation = {
        id: data.id || Date.now().toString(),
        donator: data.donator_name || data.name || "Anonymous",
        amount: Number(data.amount_raw || data.amount || 0),
        message: data.message || "",
        time: Date.now()
    };

    donations.push(donation);

    console.log("🔥 DONASI:", donation);

    res.send("OK");
});

// GET DATA
app.get("/donations", (req, res) => {
    res.json(donations);
});

// ROOT TEST
app.get("/", (req, res) => {
    res.send("SERVER RUNNING");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Server jalan di port " + PORT);
});