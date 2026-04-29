app.post("/sociabuzz", (req, res) => {
    try {
        console.log("🔥 RAW:", JSON.stringify(req.body, null, 2));

        const data = req.body.data || req.body;

        const newDonation = {
            id: Date.now().toString(),

            // 🔥 FIX UTAMA DI SINI
            donator:
                data.customer_name ||
                data.supporter_name ||
                data.name ||
                data.username ||
                data.user?.name ||
                "UNKNOWN",

            amount: Number(data.amount) || 0,
            message: data.message || data.product_name || ""
        };

        donations.push(newDonation);

        console.log("✅ FINAL:", newDonation);

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
