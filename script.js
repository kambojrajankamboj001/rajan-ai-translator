
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const status = document.getElementById("status");

const languageCodes = {
  hindi: "hi",
  english: "en",
  punjabi: "pa",
  urdu: "ur",
  bengali: "bn",
  spanish: "es",
  french: "fr",
  german: "de",
  arabic: "ar",
  chinese: "zh",
  japanese: "ja",
  russian: "ru",
  italian: "it",
  portuguese: "pt",
  tamil: "ta",
  telugu: "te",
  marathi: "mr",
  gujarati: "gu"
};

function getLanguageCode(value) {
  const key = value.trim().toLowerCase();
  return languageCodes[key] || key;
}

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

  if (text.length > 400) {
    status.textContent = "Abhi 400 characters tak text likhein.";
    return;
  }

  const from = getLanguageCode(fromLang.value);
  const to = getLanguageCode(toLang.value);

  if (from === to) {
    status.textContent = "Dono languages alag select karein.";
    return;
  }

  status.textContent = "Translating... Please wait";

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `${from}|${to}`
    });

    const response = await fetch(
      `https://api.mymemory.translated.net/get?${params}`
    );

    if (!response.ok) {
      throw new Error("API connection failed");
    }

    const data = await response.json();

    if (
      data.responseStatus !== 200 ||
      !data.responseData?.translatedText
    ) {
      throw new Error("Translation unavailable");
    }

    outputText.value = data.responseData.translatedText;
    status.textContent = "Translation complete!";

  } catch (error) {
    console.error(error);
    status.textContent =
      "Translation nahi hua. Thodi der baad try karein.";
  }
};

document.getElementById("copyBtn").onclick = async () => {
  if (!outputText.value) {
    status.textContent = "Copy karne ke liye text nahi hai.";
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText.value);
    status.textContent = "Translation copied!";
  } catch {
    status.textContent = "Copy nahi hua.";
  }
};

document.getElementById("clearBtn").onclick = () => {
  inputText.value = "";
  outputText.value = "";
  status.textContent = "";
};
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");

voiceBtn.onclick = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    voiceStatus.textContent = "Voice feature is not supported.";
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = getLanguageCode(fromLang.value);
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceStatus.textContent = "Listening...";

  recognition.onresult = (event) => {
    inputText.value = event.results[0][0].transcript;
    voiceStatus.textContent = "Voice captured!";
  };

  recognition.onerror = () => {
    voiceStatus.textContent = "Please try again.";
  };

  recognition.start();
};
