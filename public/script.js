/* script.js */
const BASE_URL = "https://emoji-storyteller.onrender.com";

// A small list of random prompts (various languages)
const RANDOM_PROMPTS = [
  "Once upon a time, a brave knight protected a hidden kingdom.",
  "אישה מיוחדת גילתה תגלית מרעישה על הירח.",
  "Une petite ville de campagne abritait un secret magique.",
  "在一个神秘的森林里，住着一只会说话的狐狸。",
  "A curious cat discovered a hidden portal to a dragon's lair."
];

// Show/hide loading spinner
function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
}
function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

// Random Prompt: fill the textPrompt with a random prompt
function randomPrompt() {
  const randomIndex = Math.floor(Math.random() * RANDOM_PROMPTS.length);
  document.getElementById("textPrompt").value = RANDOM_PROMPTS[randomIndex];
}

// Clear All: reset inputs, outputs, emojis
function clearAll() {
  document.getElementById("textPrompt").value = "";
  document.getElementById("emojiDisplay").innerHTML = "";
  document.getElementById("storyOutput").innerText = "";
  hideSpinner();
}

// ============= Text-to-Story Flow ============= //

// Translate prompt to emojis
async function translatePrompt() {
  const prompt = document.getElementById("textPrompt").value.trim();
  const temperature = parseFloat(document.getElementById("tempInput").value) || 0.6;
  const maxTokens = parseInt(document.getElementById("maxTokensInput").value) || 300;

  if (!prompt) {
    alert("Please enter a story prompt.");
    return;
  }
  showSpinner();
  try {
    const response = await fetch(`${BASE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
        temperature: temperature,
        max_tokens: maxTokens
      })
    });
    const data = await response.json();
    const emojiDisplay = document.getElementById("emojiDisplay");
    emojiDisplay.innerHTML = "";

    // Make the emojis more prominent
    const heading = document.createElement("h3");
    heading.innerText = "Emojis:";
    heading.classList.add("text-center", "mb-3");
    emojiDisplay.appendChild(heading);

    // Split string into individual emojis (naively, by characters)
    for (const char of data.emojis) {
      if (char.trim() === "") continue;
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("emoji-span");
      span.setAttribute("data-bs-toggle", "tooltip");
      span.setAttribute("title", `Emoji: ${char}`);

      // Append to display
      emojiDisplay.appendChild(span);
      emojiDisplay.appendChild(document.createTextNode(" "));
    }

    // Re-initialize tooltips for newly created emojis
    const newTooltips = [].slice.call(document.querySelectorAll('.emoji-span[data-bs-toggle="tooltip"]'));
    newTooltips.map(function (tooltipEl) {
      return new bootstrap.Tooltip(tooltipEl);
    });
  } catch (error) {
    console.error("Error translating prompt:", error);
    alert("An error occurred while translating the prompt.");
  } finally {
    hideSpinner();
  }
}

// Generate story from the translated emoji sequence
async function generateStory() {
  const emojiSpans = document.querySelectorAll("#emojiDisplay .emoji-span");
  const temperature = parseFloat(document.getElementById("tempInput").value) || 0.6;
  const maxTokens = parseInt(document.getElementById("maxTokensInput").value) || 500;

  let emojiText = "";
  emojiSpans.forEach(span => emojiText += span.textContent);
  if (!emojiText) {
    alert("No emoji sequence found. Please translate a prompt first.");
    return;
  }
  showSpinner();
  try {
    const response = await fetch(`${BASE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emojis: emojiText,
        temperature: temperature,
        max_tokens: maxTokens
      })
    });
    const data = await response.json();
    document.getElementById("storyOutput").innerText = data.story;
  } catch (error) {
    console.error("Error generating story:", error);
    alert("An error occurred while generating the story.");
  } finally {
    hideSpinner();
  }
}

// Copy the generated story to the clipboard
function copyStory() {
  const storyText = document.getElementById("storyOutput").innerText;
  if (!storyText) {
    alert("No story to copy.");
    return;
  }
  navigator.clipboard.writeText(storyText)
    .then(() => {
      alert("Story copied to clipboard!");
    })
    .catch(err => {
      console.error("Error copying text: ", err);
      alert("Failed to copy the story.");
    });
}

