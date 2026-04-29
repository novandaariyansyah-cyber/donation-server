const express = require("express");
const app = express();

app.use(express.json());

let donations = [];

app.get("/", (req, res) => {
    res.send("SERVER HIDUP");
});

app.get("/donations", (req, res) => {
    res.json({
        status: "success",
        data: donations
    });
});

app.post("/sociabuzz", (req, res) => {
    console.log("MASUK:", req.body);

    donations.push({
        id: Date.now().toString(),
        donator: req.body.name || "Anonymous",
        amount: Number(req.body.amount) || 0,
        message: req.body.message || ""
    });

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("RUNNING ON PORT", PORT);
});
