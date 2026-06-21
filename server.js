const express = require("express");

const app = express();

app.use(express.text({ limit: "1mb" }));

app.post("/", async (req, res) => {
    try {
        const message = req.body;

        if (!message.startsWith("NOTIF|")) {
            return res.status(400).send("ERREUR: commande invalide");
        }

        const data = message.substring(6);

        const parts = data.split("/");

        if (parts.length < 4) {
            return res.status(400).send("ERREUR: paramètres manquants");
        }

        const user_email = parts[0];
        const type = parts[1];
        const title = parts[2];
        const notifMessage = parts.slice(3).join("/");

        const response = await fetch(
            "https://appsidrungame.base44.app/api/entities/Notification",
            {
                method: "POST",
                headers: {
                    "api_key": "e0faa20bd77745e9b3b1c108429a1381",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_email,
                    type,
                    title,
                    message: notifMessage
                })
            }
        );

        if (!response.ok) {
            const text = await response.text();
            return res
                .status(500)
                .send(`ERREUR: Base44 a répondu ${response.status} - ${text}`);
        }

        res.send("OK");

    } catch (err) {
        console.error(err);
        res.status(500).send(`ERREUR: ${err.message}`);
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
