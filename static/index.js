/**
 * Encrypts or decrypts a message using XOR encryption.
 * @param {string} message - The message to be encrypted or decrypted.
 * @param {string} cle - The encryption key.
 * @returns {string} - The encrypted or decrypted message.
 */
function xor_crypt(message, cle) {
    var message_code = '';
    for (let i = 0; i < message.length; i++) {
        message_code += String.fromCharCode(message.charCodeAt(i) ^ cle.charCodeAt(i % cle.length));
    }
    return message_code;
}


function inputChange() {
    if (bvElement.value === "" && preteritElement.value === "" && ppElement.value === "") {
        sendBnt.innerHTML = "Pass"
    }
    else {
        sendBnt.innerHTML = "Send"
    }
}


function FormatTime(time) {

    var minutes = Math.floor(time / 60000);
    var seconds = Math.floor((time % 60000) / 1000);

    var formattedTime = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    return formattedTime;
}


function updatetimer() {
    if (continueCountTime) {
        var currentTime = Date.now();
        var elapsedTime = currentTime - starttime;

        timer.innerHTML = FormatTime(elapsedTime);

        setTimeout(updatetimer, 500)
    }


}


function start() {
    startdiv.style.display = "none";
    testdiv.style.display = "flex";
    verbe = xor_crypt(verbes[currentQuestion][0], key);
    verbeElement.innerHTML = verbe;

    starttime = Date.now();
    timer.innerHTML = "00:00";
    updatetimer();

    questionNumber.innerHTML = "Question " + (currentQuestion + 1) + " / " + verbes.length;

    let inputs = [bvElement, preteritElement, ppElement];
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("keyup", inputChange)
        inputs[i].addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                if (i + 1 < inputs.length) {
                    inputs[i + 1].focus();
                }
                else {
                    AskQuestion();
                }
            }
        });
    }

    sendBnt.addEventListener("click", AskQuestion);


}


function showResult() {
    enddiv.style.display = "none";
    resultdiv.style.display = "flex";
    let EndTime = Date.now();

    let reponseTalbe = document.getElementById("reponse-talbe");
    let resultDiv = document.getElementById("result-div");
    var score = 0;

    let messages = []

    for (let i = 0; i < responses.length; i++) {
        let tr = document.createElement("tr");


        if ('speechSynthesis' in window) {
            let textmessage = "";
            for (let j = 0; j < 3; j++) {
                textmessage += xor_crypt(verbes[i][j + 1], key).split("/")[0] + " ";
            }
            var msg = new SpeechSynthesisUtterance(textmessage);
            msg.lang = "en-US";
            msg.rate = 0.6;

            messages.push(msg);

            let speakBtn = document.createElement("button");
            speakBtn.innerHTML = "<span class='material-symbols-outlined'>hearing</span> ";
            speakBtn.classList.add("speak-button")
            speakBtn.addEventListener("click", function () {
                window.speechSynthesis.speak(messages[i]);
            });

            tr.appendChild(speakBtn);

        }


        let rownumber = document.createElement("td");
        rownumber.innerHTML = i + 1 + ".";
        tr.appendChild(rownumber);


        let verbecase1 = document.createElement("td");
        verbecase1.innerHTML = xor_crypt(verbes[i][0], key);
        tr.appendChild(verbecase1);


        for (let j = 0; j < 3; j++) {
            let newtd = document.createElement("td");
            newtd.innerHTML = responses[i][j];

            let isCorrect = false;

            if (responses[i][j].toLowerCase() === xor_crypt(verbes[i][j + 1], key).toLocaleLowerCase()) {
                isCorrect = true;
            }

            if (xor_crypt(verbes[i][j + 1], key).includes("/")) {
                let corrects = xor_crypt(verbes[i][j + 1], key).split("/");
                if (corrects.includes(responses[i][j].toLowerCase())) {
                    isCorrect = true;
                }
            }

            if (isCorrect) {
                newtd.style.color = "#32CD32";
                score += 1;
            }
            else {
                newtd.style.color = "red";
                let responsespan = document.createElement("span");
                responsespan.innerHTML += " (" + xor_crypt(verbes[i][j + 1], key) + ")";
                responsespan.style.color = "black";
                newtd.appendChild(responsespan)
            }

            tr.appendChild(newtd);



        }
        reponseTalbe.appendChild(tr);
    }

    let scoreH2 = document.getElementById("score-h2");
    scoreH2.innerHTML = "Votre score: " + score + " / " + verbes.length*3;

    let timeP = document.getElementById("time-p");
    timeP.innerHTML = "Votre temps: " + FormatTime(EndTime - starttime);

}

/**
 * Handles the logic for asking a question and storing the user's responses.
 */
function AskQuestion() {
    responses.push([bvElement.value, preteritElement.value, ppElement.value]);

    bvElement.value = "";
    preteritElement.value = "";
    ppElement.value = "";

    bvElement.focus();

    currentQuestion += 1;

    questionNumber.innerHTML = "Question " + (currentQuestion + 1) + " / " + verbes.length;

    if (currentQuestion < verbes.length) {
        verbe = xor_crypt(verbes[currentQuestion][0], key);
        verbeElement.innerHTML = verbe;
    }
    else {
        testdiv.style.display = "none"
        enddiv.style.display = 'flex'
        console.log(responses)
        seeResultsBtn.addEventListener("click", showResult)
    }
}


const startBtn = document.getElementById("start-btn");
const verbeElement = document.getElementById("verbe-element");
const sendBnt = document.getElementById("send-btn");
const seeResultsBtn = document.getElementById("see-results-btn");

const bvElement = document.getElementById("bv-element");
const preteritElement = document.getElementById("preterit-element");
const ppElement = document.getElementById("pp-element");

const startdiv = document.getElementById("start-div");
const testdiv = document.getElementById("test-div");
const enddiv = document.getElementById("end-div");
const resultdiv = document.getElementById("result-div");

const questionNumber = document.getElementById("question-number");
const timer = document.getElementById("timer");

var starttime = Date().now;
var continueCountTime = true;


var currentQuestion = 0;
var responses = [];


startBtn.addEventListener("click", start);
