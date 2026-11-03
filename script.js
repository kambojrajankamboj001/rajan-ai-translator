// ======================================
// RAJAN AI TRANSLATOR
// COMPLETE JAVASCRIPT
// ======================================

// GET HTML ELEMENTS
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


// CHECK HTML ELEMENTS
if (
  !inputText || !outputText || !fromLang ||
  !toLang || !status || !translateBtn ||
  !voiceBtn || !voiceStatus || !speakBtn ||
  !copyBtn || !clearBtn || !swapBtn
) {
  console.error("HTML element missing. Please check element IDs.");
}


// STATUS MESSAGE
function showStatus(message) {
  status.textContent = message;
}


// LANGUAGE CODES
const speechLocales = {
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
  pt: "pt-PT",
  ru: "ru-RU",
  ja: "ja-JP",
  zh: "zh-CN",
  ko: "ko-KR",
  ar: "ar-SA"
};


// ======================================
// TRANSLATION
// ======================================

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

    if (!response.ok) {
      throw new Error("Translation server error");
    }

    const data = await response.json();

    if (
      data.responseStatus === 200 &&
      data.responseData &&
      data.responseData.translatedText
    ) {

      outputText.value = data.responseData.translatedText;

      showStatus("Translation successful!");

    } else {

      showStatus(
        data.responseDetails || "Translation unavailable. Try again."
      );

    }

  } catch (error) {

    console.error("Translation Error:", error);

    showStatus("Internet connection or server error!");

  } finally {

    translateBtn.disabled = false;

  }

};


// ======================================
// VOICE INPUT (MIC)
// ======================================

let recognition = null;

voiceBtn.onclick = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {

    voiceStatus.textContent =
      "Voice input not supported. Try Chrome browser.";

    return;

  }

  if (!window.isSecureContext) {

    voiceStatus.textContent =
      "Please open website using HTTPS.";

    return;

  }

  try {

    recognition = new SpeechRecognition();

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

    recognition.lang =
      voiceLocales[fromLang.value] || fromLang.value;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    voiceStatus.textContent = "Listening...";

    recognition.onstart = () => {

      voiceStatus.textContent = "Listening... Speak now!";

    };

    recognition.onresult = (event) => {

      const result = event.results[0][0].transcript;

      inputText.value = result;

      voiceStatus.textContent = "Voice captured successfully!";

    };

    recognition.onerror = (event) => {

      console.error("Voice Input Error:", event.error);

      const errors = {
        "not-allowed": "Please allow microphone permission.",
        "service-not-allowed": "Voice service is not allowed.",
        "network": "Voice network error. Check internet.",
        "no-speech": "No voice detected. Please speak again.",
        "audio-capture": "Microphone not found.",
        "aborted": "Voice recognition stopped.",
        "language-not-supported": "This language is not supported."
      };

      voiceStatus.textContent =
        errors[event.error] || "Voice Error: " + event.error;

    };

    recognition.onend = () => {

      if (voiceStatus.textContent === "Listening...") {
        voiceStatus.textContent = "Finished listening.";
      }

    };

    recognition.start();

  } catch (error) {

    console.error("Recognition Start Error:", error);

    voiceStatus.textContent =
      "Could not start microphone. Try again.";

  }

};


// ======================================
// SPEAKER OUTPUT
// ======================================

speakBtn.onclick = () => {

  const text = outputText.value.trim();

  if (!text) {

    showStatus("Please translate text first!");

    return;

  }

  if (!("speechSynthesis" in window)) {

    showStatus("Speaker not supported in this browser.");

    return;

  }

  try {

    // STOP PREVIOUS SPEECH
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    // SET LANGUAGE
    speech.lang =
      speechLocales[toLang.value] || toLang.value;

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {

      showStatus("Speaking...");

    };

    speech.onend = () => {

      showStatus("Finished speaking!");

    };

    speech.onerror = (event) => {

      console.error("Speaker Error:", event.error);

      showStatus("Speaker Error: " + event.error);

    };

    // RESUME SPEECH ENGINE
    window.speechSynthesis.resume();

    // PLAY SPEECH
    window.speechSynthesis.speak(speech);

  } catch (error) {

    console.error("Speaker Error:", error);

    showStatus("Unable to play voice. Try again.");

  }

};


// ======================================
// COPY TEXT
// ======================================

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

    outputText.focus();
    outputText.select();

    showStatus("Please select and copy the text.");

  }

};


// ======================================
// CLEAR TEXT
// ======================================

clearBtn.onclick = () => {

  inputText.value = "";
  outputText.value = "";

  voiceStatus.textContent = "";

  showStatus("Cleared!");

  // STOP SPEAKER
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  // STOP MICROPHONE
  if (recognition) {

    try {
      recognition.abort();
    } catch (error) {
      console.log(error);
    }

    recognition = null;

  }

};


// ======================================
// SWAP LANGUAGES
// ======================================

swapBtn.onclick = () => {

  const oldFrom = fromLang.value;

  fromLang.value = toLang.value;
  toLang.value = oldFrom;

  const oldText = inputText.value;

  inputText.value = outputText.value;
  outputText.value = oldText;

  showStatus("Languages swapped!");

};


// ======================================
// AUTOMATIC LANGUAGE DETECTION
// ======================================

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


// ======================================
// WEBSITE READY
// ======================================

console.log("Rajan AI Translator JavaScript Loaded Successfully!");
