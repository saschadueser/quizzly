// Example of created quiz App
// Skills: Asynchronous, Fetch, JSON creation, EventHandler, DOM Manipulation, simple logic
 
// TDO: Bessere Logik, Zahlen Bspw. 5 oder String "fünf" akzeptieren
// Fehler suchen beim Hervorheben von falschen QA
 
// Elements Collection
 
// Controls
const questionsLimit = 10;
 
// Others
let qaData = [];
let actualQA = {};
let playerPoints = 0;
const allQuestions = [];
 
const questionSection = document.querySelector(".question-section .question");
const textInput = document.querySelector(".answer-section input");
const textSubmitButton = document.querySelector(".answer-section button");
const nextButton = document.querySelector(".next-button")
const showQuestionsButton = document.querySelector(".show-all-questions-button");
const questionsList = document.querySelector(".questions-list");
let questionListItems;
 
// One time loading function the questions sheet
async function getQA() {
 
    // fetching...
    let res = await fetch("qa.json");
    let data = await res.json();
 
    while( qaData.length < questionsLimit) {
        let randomIndex = Math.floor(Math.random() * data.length)
 
        if(!qaData.includes(data[randomIndex])) {
            qaData.push(data[randomIndex]);
        }
    }
 
    gameLoad()
}
 
function gameLoad() {
 
    // Ausgabe der vollständigen QA Liste
    qaData.forEach( (el) => {
        const newDivEl = document.createElement("div");
        newDivEl.innerHTML = `Frage: ${el.question} <br> Antwort: ${el.answer}`;
        questionsList.appendChild(newDivEl)
        allQuestions.push(el)
    })
 
    questionListItems = document.querySelectorAll(".questions-list div");
 
    getNewQuestion();
}
 
getQA()
 
nextButton.addEventListener("click",getNewQuestion)
 
function getNewQuestion() {
 
    if(qaData.length != 0) {
        questionSection.innerHTML = `${qaData[0].question} <br> <em class="questions-remaining-text">${qaData.length} ${qaData.length >= 2 ? "Antworten" : "Antwort"} verbleidend</em>`;
        actualQA = qaData.shift();
    } else {
        questionSection.textContent = `Du hast alle Fragen beantwortet. Du hast ${playerPoints}/${questionsLimit} Fragen korrekt beantwortet.`;
        nextButton.classList.add("disabled")
        textSubmitButton.classList.add("disabled")
        showQuestionsButton.classList.remove("hidden")
    }
}
 
// Checking the answer
textSubmitButton.addEventListener("click", checkAnswer)
 
function checkAnswer() {
    if (textInput.value === "") {
        alert("Das Feld ist leer. Bitte trage deine Antwort ein.")
        return
    } else if (textInput.value.toLowerCase() === actualQA.answer.toLowerCase()) {
        alert("Richtig, weiter so!")
        playerPoints++;
        questionListItems[questionsLimit - qaData.length -1].classList.add("correct-answered")
    } else {
        alert(`Das ist leider falsch. Die richtige Antwort wäre: ${actualQA.answer}.`)
        questionListItems[questionsLimit - qaData.length -1].classList.add("wrong-answered")
    }
    textInput.value = ""
    getNewQuestion()
}
 
// Button zur Anzeige der erschienen Fragen und Antworten
showQuestionsButton.addEventListener("click", () => {
    questionsList.classList.toggle("hidden");
})