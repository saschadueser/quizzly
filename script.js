// Quiz App mit Fragen zum Allgemeinwissen, nur Deutsch.
// Skills: Asynchronous, Fetch, JSON creation, EventHandler, DOM Manipulation, simple logic
 
// TDO: Bessere Logik, Zahlen Bspw. 5 oder String "fünf" akzeptieren
// Fehler suchen beim Hervorheben von falschen QA
 
// DOM Elements
const questionSection = document.querySelector(".question-section .question");
const textInput = document.querySelector(".answer-section input");
const textSubmitButton = document.querySelector(".answer-section button");
const nextButton = document.querySelector(".next-button")
const showQuestionsButton = document.querySelector(".show-all-questions-button");
const questionsList = document.querySelector(".questions-list");
const questionsListList = document.querySelector(".questions-list-items")
const darkModeTrigger = document.querySelector(".darkmode-trigger");
 
// Controls
let questionsLimit = 10; // Limit der Fragen, die maximal erscheinen sollen. Maximum 20.
 
// Others
let qaData = []; // Array zum Speichern der zufällig ausgewählten Fragen. Reduziert sich.
const allQuestions = []; // Array zum Speichern der zufällig ausgewählten Fragen. Reduziert sich nicht.
let actualQA; // Derzeit aktive Frage
let playerPoints = 0; // Spieler Punktzahl
 
let questionListItems;
let questionsListItemsFAIcons;
 
// One time loading function the questions sheet
async function getQA() {
 
    // fetching...
    let res = await fetch("qa.json");
    let data = await res.json();
 
    // Falls Limit höher als die verfügbaren Fragen. reduziere auf die Länge der Fragen
    if(questionsLimit > data.length) {
        questionsLimit = data.length;
    }
 
    // Die Fragen filtern und speichern in der qaData Variable
    while( qaData.length < questionsLimit) {
        let randomIndex = Math.floor(Math.random() * data.length)
 
        if(!qaData.includes(data[randomIndex])) {
            qaData.push(data[randomIndex]);
        }
 
    }
 
    // Fragen nach dem Fetch direkt anzeigen
    gameLoad()
}
 
function gameLoad() {
 
    // Ausgabe der vollständigen QA Liste
    qaData.forEach( (el) => {
        const newDivEl = document.createElement("div");
        const newFaEl = document.createElement("div");
        newFaEl.classList.add("fa");
        newDivEl.innerHTML = `Frage: ${el.question} <br> Antwort: ${el.answer}`;
        questionsListList.appendChild(newDivEl);
        newDivEl.appendChild(newFaEl);
        allQuestions.push(el)
    })
 
    questionListItems = document.querySelectorAll(".questions-list-items > div");
    questionsListItemsFAIcons = document.querySelectorAll(".questions-list-items div .fa");
 
    getNewQuestion();
}
 
getQA()
 
nextButton.addEventListener("click", skipQuestion)
 
function skipQuestion() {
    questionsListItemsFAIcons[questionsLimit - qaData.length -1].classList.add("fa-forward");
    getNewQuestion()
}
 
function getNewQuestion() {
 
    if(qaData.length != 0) {
        questionSection.innerHTML = `${qaData[0].question} <br> <em class="questions-remaining-text">${qaData.length} ${qaData.length >= 2 ? "Antworten" : "Antwort"} verbleidend</em>`;
        actualQA = qaData.shift();
    } else {
        questionSection.textContent = `Du hast alle Fragen beantwortet. Du hast ${playerPoints}/${questionsLimit} Fragen korrekt beantwortet.`;
        nextButton.classList.add("disabled");
        textSubmitButton.classList.add("disabled");
        showQuestionsButton.classList.remove("hidden");
        textInput.setAttribute("disabled", true);
    }
}
 
// Checking the answer
textSubmitButton.addEventListener("click", checkAnswer)
textInput.addEventListener("keypress", checkAnswer)
function checkAnswer(e) {
    if(e.key === "Enter" || e.type === "click") {
        if (textInput.value.trim() === "") {
            console.log(textInput.value.trim())
            alert("Das Feld ist leer. Bitte trage deine Antwort ein.")
            textInput.value = "";
            textInput.focus();
            return
        }
        else if (textInput.value.toLowerCase().replace(/ /g, "") === actualQA.answer.toLowerCase().replace(/ /g, "")) {
            alert("Richtig, weiter so!")
            playerPoints++;
            questionListItems[questionsLimit - qaData.length -1].classList.add("correct-answered");
            questionsListItemsFAIcons[questionsLimit - qaData.length -1].classList.add("fa-check");
        }
        else {
            alert(`Das ist leider falsch. Die richtige Antwort wäre: ${actualQA.answer}.`)
            questionListItems[questionsLimit - qaData.length -1].classList.add("wrong-answered");
            questionsListItemsFAIcons[questionsLimit - qaData.length -1].classList.add("fa-xmark");
        }
    textInput.value = ""
    getNewQuestion()
    }
    textInput.focus();
 
}
 
// Button zur Anzeige der erschienen Fragen und Antworten
showQuestionsButton.addEventListener("click", () => {
    questionsList.classList.toggle("hidden");
})
 
// Dark-/Lightmode Trigger Funktion
function toggleDarkMode() {
    document.querySelector("body").classList.toggle("darkmode")
}
 
// Button zum Hin und Her Schalten Dark- und Lightmode
darkModeTrigger.addEventListener("click", toggleDarkMode)