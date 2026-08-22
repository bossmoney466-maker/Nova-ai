const express = require("express");

const app = express();

app.use(express.json());

app.use(express.static(__dirname));

app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "HTTP-Referer":
                        "https://nova-ai.example",

                    "X-Title":
                        "NOVA AI"
                },

                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",

                    messages: [
                        {
                            role: "system",
                            content:
                                "You are NOVA AI, a helpful, intelligent and friendly AI assistant. Give clear and useful answers."
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error:
                    data.error?.message ||
                    "OpenRouter request failed"
            });
        }

        const answer =
            data.choices?.[0]?.message?.content;

        res.json({
            answer: answer || "NOVA couldn't generate a response."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "NOVA server error"
        });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `NOVA AI running on port ${PORT}`
    );
});
