export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const message = req.body?.message;

  if (!message) {
    return res.status(400).json({ error: "No message" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "Eres un asistente médico. SOLO hablas de salud."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    console.log("GROQ RESPONSE:", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: data.error?.message || "Error en Groq API"
      });
    }

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      reply: "Error interno del servidor"
    });
  }
}
