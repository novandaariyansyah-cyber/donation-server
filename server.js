const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const FILE = "donations.json";

// ✅ GAS URL LO (SUDAH DIMASUKKAN)
const GAS_URL = "https://script.google.com/macros/s/AKfycbzPKqOTs77i_kLzrOKWRkhK-HSDYOgpibJ7T6xgdBIzY1yFQwRMxt7lCI2fPRwPjSHO/exec";

// ================= LOAD DATA =================
let donations = [];
if (fs.existsSync(FILE)) {
    donations = JSON.parse(fs.readFileSync(FILE));
}

// ================= SAVE =================
function saveData() {
    fs.writeFileSync(FILE, JSON.stringify(donations, null, 2));
}

// ================= WEBHOOK =================
app.post("/webhook", async (req, res) => {
    try {
        const data = req.body;

        const id = data.id || Date.now().toString();
        const donator = data.name || data.donator_name || "Anonymous";
        const amount = data.amount || data.amount_raw || 0;
        const message = data.message || "";

        // ❌ anti duplicate
        if (donations.some(d => d.id === id)) {
            return res.json({ status: "duplicate" });
        }

        const newData = {
            id,
            donator,
            amount,
            message,
            date: new Date()
        };

        donations.push(newData);
        saveData();

        console.log("🔥 DONASI:", donator, amount);

        // ================= KIRIM KE GAS (FIX FORMAT) =================
        try {
            const response = await fetch(GAS_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "data=" + encodeURIComponent(JSON.stringify(newData))
            });

            const text = await response.text();
            console.log("📤 GAS RESPONSE:", text);

        } catch (err) {
            console.log("❌ GAS ERROR:", err);
        }

        res.json({ status: "ok" });

    } catch (err) {
        res.json({ status: "error" });
    }
});

// ================= DATA BARU =================
let lastId = null;

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

// ================= ALL DATA =================
app.get("/all", (req, res) => {
    res.json({
        total: donations.length,
        data: donations
    });
});

// ================= PORT =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("SERVER RUNNING", PORT);
});