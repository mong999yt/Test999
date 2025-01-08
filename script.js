// List of words with English full words, split words, and Thai meanings
const words = [
  { full: "prepare", split: "PRE-PARE", thai: "จัดเตรียม" },
  { full: "available", split: "A-VAIL-A-BLE", thai: "หาได้" },
  { full: "raw food", split: "RAW FOOD", thai: "อาหารดิบ" },
  { full: "low-calorie food", split: "LOW-CAL-O-RIE FOOD", thai: "อาหารพลังงานต่ำ" },
  { full: "recommend", split: "REC-O-MMEND", thai: "แนะนำ" },
  { full: "vegan diet", split: "VE-GAN DI-ET", thai: "อาหารมังสวิรัติ" },
  { full: "ingredient", split: "IN-GRE-DI-ENT", thai: "ส่วนผสม" },
  { full: "dairy food", split: "DAI-RY FOOD", thai: "อาหารประเภทนมเนย" },
  { full: "ancestor", split: "AN-CES-TOR", thai: "บรรพบุรุษ" },
  { full: "increase", split: "IN-CREASE", thai: "เพิ่มขึ้น" },
  { full: "extinct", split: "EX-TINCT", thai: "สูญสิ้น" },
  { full: "language", split: "LAN-GUAGE", thai: "ภาษา" },
  { full: "endangered", split: "EN-DAN-GERED", thai: "ใกล้สูญพันธุ์" },
  { full: "crowded", split: "CROWD-ED", thai: "แออัด" },
  { full: "native speaker", split: "NA-TIVE SPEAK-ER", thai: "เจ้าของภาษา" },
  { full: "population", split: "POP-U-LA-TION", thai: "ประชากร" },
  { full: "traffic", split: "TRAF-FIC", thai: "การจราจร" },
  { full: "sidewalk", split: "SIDE-WALK", thai: "ทางเท้า" },
  { full: "vehicle", split: "VE-HI-CLE", thai: "ยานพาหนะ" },
  { full: "neighborhood", split: "NEIGH-BOR-HOOD", thai: "ละแวกบ้าน" },
];

let currentWordIndex = 0;
let userAnswers = [];

// Initialize the first word
function loadWord() {
  const word = words[currentWordIndex];
  document.getElementById("split-word").innerText = word.split;
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

// Load the first word when the page loads
loadWord();
