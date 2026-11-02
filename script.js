
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const status = document.getElementById("status");

const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");
const speakBtn = document.getElementById("speakBtn");
const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");

// Language codes
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

function showStatus(message) {
  if (status) status.textContent = message;
}

// TRANSLATE
if (translateBtn) {
  translateBtn.onclick = async () => {
    const text = inputText.value.trim();

    if (!text) {
      showStatus("Please enter some text!");
      return;
    }

    if (text.length > 500) {
      showStatus("Please enter maximum 500 characters.");
      return;
    }

    const from = getLanguageCode(fromLang.value);
    const to = getLanguageCode(toLang.value);

    if (from === to) {
      outputText.value = text;
      showStatus("Both languages are same!");
      return;
    }

    try {
      showStatus("Translating...");
      translateBtn.disabled = true;

      const url =
        "https://api.mymemory.translated.net/get?q=" +
        encodeURIComponent(text) +
        "&langpair=" +
        encodeURIComponent(from + "|" + to);

      const response = await fetch(url);
      const data = await response.json();

      if (data.responseStatus === 200) {
        outputText.value = data.responseData.translatedText;
        showStatus("Translation successful!");
      } else {
        showStatus("Translation failed. Please try again.");
      }

    } catch (error) {
      showStatus("Internet connection error!");
    } finally {
      translateBtn.disabled = false;
    }
  };
}

// VOICE INPUT
if (voiceBtn) {
  voiceBtn.onclick = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (voiceStatus) {
        voiceStatus.textContent = "Voice not supported.";
      }
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    if (voiceStatus) {
      voiceStatus.textContent = "Listening...";
    }

    recognition.onresult = (event) => {
      inputText.value =
        event.results[0][0].transcript;

      if (voiceStatus) {
        voiceStatus.textContent = "Voice captured!";
      }
    };

    recognition.onerror = () => {
      if (voiceStatus) {
        voiceStatus.textContent = "Please try again.";
      }
    };

    recognition.start();
  };
}

// SPEAKER OUTPUT
if (speakBtn) {
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

    const targetLanguage =
      getLanguageCode(toLang.value);

    const speechLanguages = {
      en: "en-US",
      hi: "hi-IN",
      pa: "pa-IN",
      ur: "ur-PK",
      bn: "bn-IN",
      gu: "gu-IN",
      mr: "mr-IN",
      ta: "ta-IN",
      te: "te-IN",
      fr: "fr-FR",
      de: "de-DE",
      es: "es-ES",
      it: "it-IT",
      ja: "ja-JP",
      zh: "zh-CN"
    };

    speech.lang =
      speechLanguages[targetLanguage] || targetLanguage;

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
}

// COPY
if (copyBtn) {
  copyBtn.onclick = async () => {
    if (!outputText.value.trim()) {
      showStatus("Nothing to copy!");
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText.value);
      showStatus("Copied successfully!");
    } catch (error) {
      showStatus("Copy failed!");
    }
  };
}

// CLEAR
if (clearBtn) {
  clearBtn.onclick = () => {
    inputText.value = "";
    outputText.value = "";
    showStatus("Cleared!");
    if (voiceStatus) voiceStatus.textContent = "";
  };
}

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
    option => getLanguageCode(option.value) === detected
  );

  if (option) {
    fromLang.value = option.value;
    showStatus("Language detected automatically!");
  }
});
