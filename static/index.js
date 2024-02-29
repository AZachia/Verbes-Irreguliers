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
    }

    sendBnt.addEventListener("click", AskQuestion);


}

function AskQuestion() {
    responses.push([bvElement.value, preteritElement.value, ppElement.value]);
    
    bvElement.value = "";
    preteritElement.value = "";
    ppElement.value = "";

    currentQuestion += 1;
    if (currentQuestion < verbes.length) {
        verbe = xor_crypt(verbes[currentQuestion][0], key);
        verbeElement.innerHTML = verbe;
    }
    else {
        testdiv.style.display = "none"
        enddiv.style.display = 'flex'
        console.log(responses)

    }
}


const startBtn = document.getElementById("start-btn");
const verbeElement = document.getElementById("verbe-element");
const sendBnt = document.getElementById("send-btn");

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
