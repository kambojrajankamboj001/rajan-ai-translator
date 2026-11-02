const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const status = document.getElementById("status");

document.getElementById("swapBtn").onclick = () => {
  const oldFrom = fromLang.value;
  fromLang.value = toLang.value;
  toLang.value = oldFrom;

  const oldText = inputText.value;
  inputText.value = outputText.value;
  outputText.value = oldText;
};

document.getElementById("translateBtn").onclick = async () => {
  const text = inputText.value.trim();

  if (!text) {
    status.textContent = "Pehle text likho!";
    return;
  }

  status.textContent = "Translating...";

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        from: fromLang.value,
        to: toLang.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Translation failed");
    }

    outputText.value = data.translation;
    status.textContent = "Translation complete!";
  } catch (error) {
    status.textContent =
      "Backend connect nahi hua. Next step mein setup karenge.";
  }
};

document.getElementById("copyBtn").onclick = async () => {
  if (!outputText.value) return;

  await navigator.clipboard.writeText(outputText.value);
  status.textContent = "Translation copied!";
};

document.getElementById("clearBtn").onclick = () => {
  inputText.value = "";
  outputText.value = "";
  status.textContent = "";
};
