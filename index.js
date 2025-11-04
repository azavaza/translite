import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ OpenAI Proxy работает! Все отлично 👌");
});

app.post("/translate", async (req, res) => {
  const { text, lang } = req.body;

  if (!text || !lang) {
    return res.status(400).json({ error: "Отсутствует текст или язык" });
  }

  const prompt = `Переведи этот HTML на ${lang}, сохрани структуру, ссылки и форматирование, но измени только текстовые части:\n\n${text}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Ошибка при обращении к OpenAI:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ✅ Обязательно именно так:
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Сервер запущен и слушает порт ${PORT}`);
});

