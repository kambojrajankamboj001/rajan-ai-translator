
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

  recognition.lang = "hi-IN";
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
document.getElementById("speakBtn").onclick = () => {
  const text = outputText.value.trim();

  if (!text) {
    status.textContent = "Pehle translate karo!";
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 0.9;

  speech.onstart = () => {
    status.textContent = "Speaking...";
  };

  speech.onend = () => {
    status.textContent = "Finished!";
  };

  speech.onerror = (event) => {
    status.textContent = "Voice error: " + event.error;
  };

  window.speechSynthesis.speak(speech);
};
  const text = outputText.value.trim();

  if (!text) {
    status.textContent = "Pehle translate karo!";
    return;
  }

  if (!("speechSynthesis" in window)) {
    status.textContent = "Speaker supported nahi hai.";
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 0.9;

  speech.onstart = () => {
  status.textContent = "Speaking...";
};

speech.onerror = (event) => {
  status.textContent = "Voice error: " + event.error;
};

  status.textContent = "Speaking...";
};
function detectLanguage(text) {
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0A00-\u0A7F]/.test(text)) return "pa";
  if (/[\u0600-\u06FF]/.test(text)) return "ur";
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu";

  if (/[a-zA-Z]/.test(text)) return "en";

  return null;
}

inputText.addEventListener("input", () => {
  const detected = detectLanguage(inputText.value.trim());

  if (!detected) return;

  const option = Array.from(fromLang.options).find(
    option => getLanguageCode(option.value) === detected
  );

  if (option) {
    fromLang.value = option.value;
    status.textContent = "Language detected automatically!";
  }
});
