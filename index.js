import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/translate", async (req, res) => {
  const { text, lang } = req.body;
  const key = process.env.OPENAI_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ты переводчик. Переводи точно и естественно." },
        { role: "user", content: `Переведи текст на язык ${lang}: ${text}` }
      ]
    }),
  });

  const data = await response.json();
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
