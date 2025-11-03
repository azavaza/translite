import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, lang } = req.body;
  const prompt = `Переведи этот HTML на ${lang}, сохрани структуру, ссылки и форматирование, но измени только текстовые части:\n\n${text}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    res.json(data); // ⚡ обязательно json, иначе WP не получит ответ
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => res.send("✅ Transliteration proxy active"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

