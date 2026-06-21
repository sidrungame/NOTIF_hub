const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

console.log("WebSocket serveur lancé");

wss.on("connection", (ws) => {
    console.log("Client connecté");

    ws.on("message", async (msg) => {
        try {
            const message = msg.toString();

            console.log("Reçu:", message);

            // Format attendu:
            // NOTIF|email/type/title/message
            if (!message.startsWith("NOTIF|")) {
                return ws.send("ERREUR: commande invalide");
            }

            const data = message.substring(6);
            const parts = data.split("/");

            if (parts.length < 4) {
                return ws.send("ERREUR: paramètres manquants");
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
                return ws.send(`ERREUR: Base44 ${response.status} - ${text}`);
            }

            ws.send("OK");

        } catch (err) {
            console.error(err);
            ws.send("ERREUR: " + err.message);
        }
    });

    ws.on("close", () => {
        console.log("Client déconnecté");
    });
});
