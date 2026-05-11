import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: "TU_API_KEY_AQUI"
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente médico informativo. SOLO puedes responder sobre salud. Si te preguntan otra cosa, di que solo puedes tratar temas de salud."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    res.json({ reply: "Error en la API." });
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});
