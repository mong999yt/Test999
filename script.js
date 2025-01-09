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

let selectedWords = [];
let currentWordIndex = 0;
let userAnswers = [];
let showEnglish = true;
let showThai = true;

// Shuffle array function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initialize word selection checkboxes
function initWordSelection() {
  const wordSelection = document.getElementById("word-selection");
  words.forEach((word, index) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `word-${index}`;
    checkbox.value = index;

    const label = document.createElement("label");
    label.htmlFor = `word-${index}`;
    label.innerText = word.full;

    const div = document.createElement("div");
    div.appendChild(checkbox);
    div.appendChild(label);

    wordSelection.appendChild(div);
  });
}

// Select all words
function selectAllWords() {
  const checkboxes = document.querySelectorAll("#word-selection input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
}

// Start practice with selected words
function startPractice() {
  selectedWords = [];
  const checkboxes = document.querySelectorAll("#word-selection input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedWords.push(words[checkbox.value]);
    }
  });

  if (selectedWords.length === 0) {
    alert("Please select at least one word to practice!");
    return;
  }

  // Shuffle selected words
  shuffleArray(selectedWords);

  currentWordIndex = 0;
  userAnswers = [];
  document.getElementById("practice-section").classList.remove("hide");
  document.querySelector(".checkbox-list").classList.add("hide");
  loadWord();
}

// Load the current word
function loadWord() {
  const word = selectedWords[currentWordIndex];
  document.getElementById("split-word").innerText = showEnglish ? word.split.toLowerCase() : '';
  document.getElementById("thai-meaning").innerText = showThai ? word.thai : '';

  // Play the word automatically when loaded
  playWord();
}

// Play the current word in normal and slow speeds, with pauses in between
function playWord() {
  const word = selectedWords[currentWordIndex].full;
  const utteranceNormal = new SpeechSynthesisUtterance(word);
  utteranceNormal.rate = 1; // Normal speed
  utteranceNormal.onend = () => {
    setTimeout(() => {
      const utteranceSlow = new SpeechSynthesisUtterance(word);
      utteranceSlow.rate = 0.5; // Slow speed
      utteranceSlow.onend = () => {
        setTimeout(() => {
          speechSynthesis.cancel(); // Stop after slow speed
        }, 2000); // Wait 2 seconds before stopping
      };
      speechSynthesis.speak(utteranceSlow);
    }, 2000); // Wait 2 seconds before slow speed
  };
  speechSynthesis.speak(utteranceNormal);
}

// Submit answer and save results
function submitAnswer() {
  const englishInput = document.getElementById("english-input").value.trim().toLowerCase();
  const thaiInput = document.getElementById("thai-input").value.trim();

  const currentWord = selectedWords[currentWordIndex];
  const isEnglishCorrect = englishInput === currentWord.full.toLowerCase(); // เปรียบเทียบเป็นตัวพิมพ์เล็ก
  const isThaiCorrect = thaiInput === currentWord.thai; // ภาษาไทยไม่ต้องแปลง

  userAnswers.push({
    word: currentWord.full,
    englishCorrect: isEnglishCorrect,
    thaiCorrect: isThaiCorrect,
  });

  currentWordIndex++;
  if (currentWordIndex < selectedWords.length) {
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
      answer.englishCorrect ? "✅ ถูก" : "❌ ผิด!!"
    }, Thai: ${answer.thaiCorrect ? "✅ ถูก" : "❌ ผิด!!"}</p>`;
  });
  document.getElementById("results").innerHTML = html;

  document.getElementById("practice-section").classList.add("hide");
  document.querySelector(".checkbox-list").classList.remove("hide");
}

// Toggle visibility of all words
function toggleWords() {
  showEnglish = !showEnglish;
  showThai = !showThai;

  const word = selectedWords[currentWordIndex];
  document.getElementById("split-word").innerText = showEnglish ? word.split.toLowerCase() : '';
  document.getElementById("thai-meaning").innerText = showThai ? word.thai : '';

  // Play the word automatically when toggling words
  playWord();
}

// Initialize the app
initWordSelection();