document.getElementById("correctBtn").addEventListener("click", async () => {
  const inputText = document.getElementById("inputText").value.trim();
  if (!inputText) return;

  // Display a loading message
  document.getElementById("outputText").innerText = "Checking...";

  try {
    // LanguageTool API endpoint (for English)
    const url = "https://api.languagetoolplus.com/v2/check";
    const params = new URLSearchParams();
    params.append("text", inputText);
    params.append("language", "en-US");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await response.json();

    // Process corrections from the API response:
    let correctedText = inputText;
    if (data.matches && data.matches.length > 0) {
      // Apply corrections from the end to the beginning to avoid offset issues.
      const corrections = data.matches.sort((a, b) => b.offset - a.offset);
      corrections.forEach((match) => {
        if (match.replacements && match.replacements.length > 0) {
          const replacement = match.replacements[0].value;
          correctedText =
            correctedText.slice(0, match.offset) +
            replacement +
            correctedText.slice(match.offset + match.length);
        }
      });
    }

    document.getElementById("outputText").innerText = correctedText;
  } catch (error) {
    console.error("Error correcting text:", error);
    document.getElementById("outputText").innerText = "An error occurred.";
  }
});
