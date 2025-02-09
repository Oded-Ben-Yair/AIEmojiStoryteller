/* script.js */
const BASE_URL = "http://127.0.0.1:8000";

// Function for Text-to-Story Mode: Translate prompt to emojis
async function translatePrompt() {
  const prompt = document.getElementById("textPrompt").value.trim();
  if (!prompt) {
    alert("Please enter a story prompt.");
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt })
    });
    const data = await response.json();
    document.getElementById("emojiDisplay").innerText = "Emojis: " + data.emojis;
  } catch (error) {
    console.error("Error translating prompt:", error);
    alert("An error occurred while translating the prompt.");
  }
}

// Function for Text-to-Story Mode: Generate story from the translated emoji sequence
async function generateStory() {
  const emojiText = document.getElementById("emojiDisplay").innerText.replace("Emojis: ", "").trim();
  if (!emojiText) {
    alert("No emoji sequence found. Please translate a prompt first.");
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emojis: emojiText })
    });
    const data = await response.json();
    document.getElementById("storyOutput").innerText = data.story;
  } catch (error) {
    console.error("Error generating story:", error);
    alert("An error occurred while generating the story.");
  }
}

// Function for Emoji-to-Story Mode: Generate story directly from emoji input
async function generateStoryFromEmojis() {
  const emojiInput = document.getElementById("emojiInput").value.trim();
  if (!emojiInput) {
    alert("Please enter an emoji sequence.");
    return;
  }
  try {
    const response = await fetch(`${BASE_URL}/reverse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emojis: emojiInput })
    });
    const data = await response.json();
    document.getElementById("storyOutput").innerText = data.story;
  } catch (error) {
    console.error("Error generating story from emojis:", error);
    alert("An error occurred while generating the story from emojis.");
  }
}

