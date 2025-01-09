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
let isPlaying = false;

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

  currentWordIndex = 0;
  userAnswers = [];
  document.getElementById("practice-section").classList.remove("hide");
  document.querySelector(".checkbox-list").classList.add("hide");
  loadWord();
}

// Load the current word
function loadWord() {
  stopWord();
  const word = selectedWords[currentWordIndex];
  document.getElementById("split-word").innerText = word.split.toLowerCase();
  document.getElementById("thai-meaning").innerText = word.thai;
  playWord(word.full);
}

// Play the current word in a loop with normal and slow speeds, with pauses in between
function playWord(word) {
  isPlaying = true;

  function speakNormalThenSlow() {
    if (!isPlaying) return;

    const utteranceNormal = new SpeechSynthesisUtterance(word);
    utteranceNormal.rate = 1; // Normal speed
    utteranceNormal.onend = () => {
      if (!isPlaying) return;
      setTimeout(() => {
        const utteranceSlow = new SpeechSynthesisUtterance(word);
        utteranceSlow.rate = 0.5; // Slow speed
        utteranceSlow.onend = () => {
          if (isPlaying) {
            setTimeout(speakNormalThenSlow, 2000); // Wait 2 seconds and loop
          }
        };
        speechSynthesis.speak(utteranceSlow);
      }, 2000); // Wait 2 seconds before slow speed
    };

    speechSynthesis.speak(utteranceNormal);
  }

  speakNormalThenSlow();
}

// Stop the current word from playing
function stopWord() {
  isPlaying = false;
  speechSynthesis.cancel();
}

// Submit answer and save results
function submitAnswer() {
  stopWord();

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

  alert("Answer saved! Press 'Next' to continue.");
}

// Move to the next word
function nextWord() {
  stopWord();
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
      answer.englishCorrect ? "✅ Correct" : "❌ Incorrect"
    }, Thai: ${answer.thaiCorrect ? "✅ Correct" : "❌ Incorrect"}</p>`;
  });
  document.getElementById("results").innerHTML = html;

  document.getElementById("practice-section").classList.add("hide");
  document.querySelector(".checkbox-list").classList.remove("hide");
}

// Initialize the app
initWordSelection();
