import fs from "fs";
import fetch from "node-fetch"; // ✅ Required for fetch in Node

const HF_API_URL = "https://api-inference.huggingface.co/models/mjendrusch/food-quality-checker";

// 👉 Replace with your actual Hugging Face API Key
const HF_API_KEY = "hf_your_real_api_key_here";

class HygieneAnalyzer {
  async analyzeImage(imagePath) {
    try {
      console.log("🔎 Uploading image to Hugging Face API...");
      const image = fs.readFileSync(imagePath);

      const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: image,
      });

      const text = await response.text();
      console.log("🔎 Raw API response:", text);

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText} -> ${text}`);
      }

      const results = JSON.parse(text);

      if (!Array.isArray(results) || results.length === 0) {
        throw new Error("No classification results returned");
      }

      const top = results.sort((a, b) => b.score - a.score)[0];
      return {
        label: top.label,
        score: top.score,
      };
    } catch (err) {
      console.error("❌ Error analyzing image:", err);
      throw new Error("Image analysis failed");
    }
  }
}

export const hygieneAnalyzer = new HygieneAnalyzer();
