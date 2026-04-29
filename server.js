const express = require("express");
const app = express();

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
        const raw = req.body;

        console.log("🔥 FULL PAYLOAD:");
        console.log(JSON.stringify(raw, null, 2));

        // ambil layer data (kadang nested)
        const data = raw.data || raw;

        // 🔥 ambil nama TANPA anonymous
        let name =
            data.supporter_name ||
            data.name ||
            data.username ||
            data.display_name ||
            data.user?.name ||
            data.user ||
            data.from ||
            data.email;

        // 🔥 kalau tetap tidak ada → paksa jadi string (biar kelihatan)
        if (!name) {
            name = "Sociabuzz User"; // bukan anonymous
        }

        const newDonation = {
            id: Date.now().toString(),
            donator: String(name),
            amount:
                Number(data.amount) ||
                Number(data.amount_total) ||
                Number(data.price) ||
                Number(data.value) ||
                0,
            message:
                data.message ||
                data.comment ||
                data.notes ||
                ""
        };

        donations.push(newDonation);

        if (donations.length > 50) donations.shift();

        console.log("✅ FINAL DATA:", newDonation);

        res.sendStatus(200);
    } catch (err) {
        console.error("❌ ERROR:", err);
        res.sendStatus(500);
    }
});

// =============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("RUNNING ON PORT", PORT);
});
