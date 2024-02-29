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


function start() {
    startdiv.style.display = "none"
    testdiv.style.display = "flex"
    verbe = xor_crypt(verbes[currentQuestion][0], key);
    verbeElement.innerHTML = verbe;

    let inputs = [bvElement, preteritElement, ppElement];
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener("keyup", inputChange)
        inputs[i].addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                if (i+1 < inputs.length) {
                    inputs[i+1].focus();
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

    for (let i = 0; i < responses.length; i++) {
        let div = document.createElement("div");
        let span = document.createElement("span");

        span.innerHTML = [xor_crypt(verbes[i][0], key), responses[i][0], responses[i][1], responses[i][2]].join(" ; ");

        div.appendChild(span);

        resultdiv.appendChild(div);
    }
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


var currentQuestion = 0;
var responses = [];


startBtn.addEventListener("click", start);
