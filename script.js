// List of words with English full words, split words, and Thai meanings
const words = [
  { full: "prepare", split: "pre-pare", thai: "จัดเตรียม" },
  { full: "available", split: "a-vail-a-ble", thai: "หาได้" },
  { full: "raw food", split: "raw food", thai: "อาหารดิบ" },
  { full: "low-calorie food", split: "low-cal-o-rie food", thai: "อาหารพลังงานต่ำ" },
  { full: "recommend", split: "rec-o-mmend", thai: "แนะนำ" },
  { full: "vegan diet", split: "ve-gan di-et", thai: "อาหารมังสวิรัติ" },
  { full: "ingredient", split: "in-gre-di-ent", thai: "ส่วนผสม" },
  { full: "dairy food", split: "dai-ry food", thai: "อาหารประเภทนมเนย" },
  { full: "ancestor", split: "an-ces-tor", thai: "บรรพบุรุษ" },
  { full: "increase", split: "in-crease", thai: "เพิ่มขึ้น" },
  { full: "extinct", split: "ex-tinct", thai: "สูญสิ้น" },
  { full: "language", split: "lan-guage", thai: "ภาษา" },
  { full: "endangered", split: "en-dan-gered", thai: "ใกล้สูญพันธุ์" },
  { full: "crowded", split: "crowd-ed", thai: "แออัด" },
  { full: "native speaker", split: "na-tive speak-er", thai: "เจ้าของภาษา" },
  { full: "population", split: "pop-u-la-tion", thai: "ประชากร" },
  { full: "traffic", split: "traf-fic", thai: "การจราจร" },
  { full: "sidewalk", split: "side-walk", thai: "ทางเท้า" },
  { full: "vehicle", split: "ve-hi-cle", thai: "ยานพาหนะ" },
  { full: "neighborhood", split: "neigh-bor-hood", thai: "ละแวกบ้าน" },
];

let currentWordIndex = 0;
let userAnswers = [];
let isHidden = false; // State for visibility of split word and Thai meaning

// Initialize the first word
function loadWord() {
  const word = words[currentWordIndex];
  document.getElementById("split-word").innerText = word.split.toLowerCase(); // Ensure split word is lowercase
  document.getElementById("thai-meaning").innerText = word.thai; // Show Thai meaning
  speakWord(word.full, false); // Speak in normal speed
  setTimeout(() => speakWord(word.full, true), 5000); // Speak in slow speed after 5 seconds
}

// Speak the word
function speakWord(text, slow) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = slow ? 0.5 : 1;
  speechSynthesis.speak(utterance);
}

// Submit answer and load the next word
function submitAnswer() {
  const englishInput = document.getElementById("english-input").value.trim().toLowerCase();
  const thaiInput = document.getElementById("thai-input").value.trim();

  const currentWord = words[currentWordIndex];
  const isEnglishCorrect = englishInput === currentWord.full.toLowerCase();
  const isThaiCorrect = thaiInput === currentWord.thai;

  userAnswers.push({
    word: currentWord.full,
    englishCorrect: isEnglishCorrect,
    thaiCorrect: isThaiCorrect,
  });

  currentWordIndex++;

  if (currentWordIndex < words.length) {
    document.getElementById("english-input").value = "";
    document.getElementById("thai-input").value = "";
    loadWord();
  } else {
    showResults();
  }
}

// Show results after all words
function showResults() {
  let html = "<h2>Results</h2>";
  userAnswers.forEach((answer, index) => {
    html += `<p><strong>${index + 1}. ${answer.word}</strong> - English: ${
      answer.englishCorrect ? "✅ Correct" : "❌ Incorrect"
    }, Thai: ${answer.thaiCorrect ? "✅ Correct" : "❌ Incorrect"}</p>`;
  });
  document.getElementById("results").innerHTML = html;
}

// Toggle visibility of split word and Thai meaning
function toggleVisibility() {
  const splitWordElement = document.getElementById("split-word");
  const thaiMeaningElement = document.getElementById("thai-meaning");

  if (isHidden) {
    splitWordElement.classList.remove("hide");
    thaiMeaningElement.classList.remove("hide");
    document.querySelector("button").innerText = "Hide Words";
  } else {
    splitWordElement.classList.add("hide");
    thaiMeaningElement.classList.add("hide");
    document.querySelector("button").innerText = "Show Words";
  }

  isHidden = !isHidden;
}

// Load the first word when the page loads
loadWord();
