export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { base64Image } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64Image } },
          { type: "text", text: "You are a nutrition expert AI. Look at this food photo and provide:\n1. What food(s) you can see\n2. Estimated total calories\n3. Protein (grams)\n4. Carbohydrates (grams)\n5. Fat (grams)\n\nFormat your response like this:\n🍽️ Food: [food name]\n🔥 Calories: [number] kcal\n💪 Protein: [number]g\n🍞 Carbs: [number]g\n🧈 Fat: [number]g\n📝 Note: [brief tip]" }
        ]
      }]
    })
  });

  const data = await response.json();
  res.json({ result: data.content[0].text });
}