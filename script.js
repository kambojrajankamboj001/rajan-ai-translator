
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const status = document.getElementById("status");

const translateBtn = document.getElementById("translateBtn");
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");
const speakBtn = document.getElementById("speakBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const swapBtn = document.getElementById("swapBtn");

function showStatus(message) {
  status.textContent = message;
}

// TRANSLATION
translateBtn.onclick = async () => {
  const text = inputText.value.trim();

  if (!text) {
    showStatus("Please enter some text!");
    return;
  }

  if (text.length > 500) {
    showStatus("Maximum 500 characters allowed.");
    return;
  }

  const from = fromLang.value;
  const to = toLang.value;

  if (from === to) {
    outputText.value = text;
    showStatus("Both languages are same!");
    return;
  }

  try {
    translateBtn.disabled = true;
    showStatus("Translating...");

    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      "&langpair=" +
      encodeURIComponent(from + "|" + to);

    const response = await fetch(url);
    const data = await response.json();

    if (
      data.responseStatus === 200 &&
      data.responseData &&
      data.responseData.translatedText
    ) {
      outputText.value = data.responseData.translatedText;
      showStatus("Translation successful!");
    } else {
      showStatus("Translation unavailable. Try another language.");
    }
  } catch (error) {
    showStatus("Internet connection error!");
  } finally {
    translateBtn.disabled = false;
  }
};

// VOICE INPUT
voiceBtn.onclick = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    voiceStatus.textContent = "Voice not supported in this browser.";
    return;
  }

  const recognition = new SpeechRecognition();

  const voiceLocales = {
    hi: "hi-IN",
    en: "en-IN",
    pa: "pa-IN",
    ur: "ur-IN",
    bn: "bn-IN",
    gu: "gu-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    te: "te-IN"
  };

  recognition.lang = voiceLocales[fromLang.value] || fromLang.value;
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

  recognition.onend = () => {
    if (voiceStatus.textContent === "Listening...") {
      voiceStatus.textContent = "Finished listening.";
    }
  };

  recognition.start();
};

// SPEAKER OUTPUT
speakBtn.onclick = () => {
  const text = outputText.value.trim();

  if (!text) {
    showStatus("Pehle translate karo!");
    return;
  }

  if (!("speechSynthesis" in window)) {
    showStatus("Speaker not supported.");
    return;
  }

  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);

  const speechLocales = {
    en: "en-US",
    hi: "hi-IN",
    pa: "pa-IN",
    ur: "ur-IN",
    bn: "bn-IN",
    gu: "gu-IN",
    mr: "mr-IN",
    ta: "ta-IN",
    te: "te-IN",
    fr: "fr-FR",
    de: "de-DE",
    es: "es-ES",
    it: "it-IT",
    pt: "pt-PT",
    ru: "ru-RU",
    ja: "ja-JP",
    zh: "zh-CN",
    ko: "ko-KR",
    ar: "ar-SA"
  };

  speech.lang = speechLocales[toLang.value] || toLang.value;
  speech.rate = 0.9;

  speech.onstart = () => {
    showStatus("Speaking...");
  };

  speech.onend = () => {
    showStatus("Finished!");
  };

  speech.onerror = (event) => {
    showStatus("Voice error: " + event.error);
  };

  window.speechSynthesis.speak(speech);
};

// COPY
copyBtn.onclick = async () => {
  const text = outputText.value.trim();

  if (!text) {
    showStatus("Nothing to copy!");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showStatus("Copied successfully!");
  } catch (error) {
    outputText.select();
    showStatus("Select the text and copy it.");
  }
};

// CLEAR
clearBtn.onclick = () => {
  inputText.value = "";
  outputText.value = "";
  voiceStatus.textContent = "";
  showStatus("Cleared!");
  window.speechSynthesis.cancel();
};

// SWAP LANGUAGES
swapBtn.onclick = () => {
  const oldFrom = fromLang.value;

  fromLang.value = toLang.value;
  toLang.value = oldFrom;

  const oldText = inputText.value;
  inputText.value = outputText.value;
  outputText.value = oldText;

  showStatus("Languages swapped!");
};

// AUTOMATIC LANGUAGE DETECTION
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
    option => option.value === detected
  );

  if (option) {
    fromLang.value = detected;
    showStatus("Language detected automatically!");
  }
});
