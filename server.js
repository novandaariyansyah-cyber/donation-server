const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let donations = [];
let lastId = null;

// WEBHOOK
app.post("/webhook", (req, res) => {
    const data = req.body;

    const id = data.id || Date.now().toString();
    const donator = data.name || data.donator_name || "Anonymous";
    const amount = data.amount || data.amount_raw || 0;
    const message = data.message || "";

    if (donations.find(d => d.id === id)) {
        return res.json({ status: "duplicate" });
    }

    donations.push({ id, donator, amount, message });

    console.log("🔥 DONASI MASUK:", donator, amount);

    res.json({ status: "ok" });
});

// ROBLOX AMBIL DATA
app.get("/donations", (req, res) => {
    let newData = [];

    for (let i = donations.length - 1; i >= 0; i--) {
        if (donations[i].id === lastId) break;
        newData.push(donations[i]);
    }

    if (newData.length > 0) {
        lastId = newData[0].id;
    }

    res.json({
        status: "success",
        data: newData.reverse()
    });
});

// PORT (WAJIB untuk Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("SERVER JALAN DI PORT", PORT);
});