const API_KEY =
  "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";
const imageInput = document.getElementById("foodImage");
const preview = document.getElementById("preview");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");
const log = document.getElementById("log");
let currentBase64 = "";
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    preview.src = ev.target.result;
    preview.style.display = "block";
    analyzeBtn.style.display = "block";
    currentBase64 = ev.target.result.split(",")[1];
  };
  reader.readAsDataURL(file);
});
analyzeBtn.addEventListener("click", async () => {
  if (!currentBase64) return;
  analyzeBtn.textContent = "⏳ Analyzing...";
  analyzeBtn.disabled = true;
  result.style.display = "none";
  try {
    const response = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent("https://api.anthropic.com/v1/messages"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: currentBase64,
                },
              },
              {
                type: "text",
                text: `You are a nutrition expert AI. Look at this food photo and provide: 1. What food(s) you can see 2. Estimated total calories 3. Protein (grams) 4. Carbohydrates (grams) 5. Fat (grams)  Format your response like this: 🍽️ Food: [food name] 🔥 Calories: [number] kcal 💪 Protein: [number]g 🍞 Carbs: [number]g 🧈 Fat: [number]g 📝 Note: [brief tip or note]  Be concise. Give realistic estimates based on a typical serving size.`,
              },
            ],
          },
        ],
      }),
    });
    const data = await response.json();
    const text = data.content[0].text;
    result.innerHTML = text.replace(/\n/g, "<br>");
    result.style.display = "block";
    const logItem = document.createElement("div");
    logItem.className = "log-item";
    logItem.innerHTML = `<strong>📋 ${new Date().toLocaleTimeString()}</strong><br>${text.split("\n").slice(0, 2).join("<br>")}`;
    log.prepend(logItem);
  } catch (err) {
    result.innerHTML =
      "❌ Error analyzing food. Check your API key and try again.";
    result.style.display = "block";
    console.error(err);
  }
  analyzeBtn.textContent = "🔍 Analyze Food";
  analyzeBtn.disabled = false;
});
