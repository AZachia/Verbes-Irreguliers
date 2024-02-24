function xor_crypt(message, cle) {
    var message_code = '';
    for (let i = 0; i < message.length; i++) {
        message_code += String.fromCharCode(message.charCodeAt(i) ^ cle.charCodeAt(i % cle.length));
    }
    return message_code;
}



function start() {
    for (let i = 0; i < verbes.length; i++) {
        verbe = xor_crypt(verbes[i][0], key);
        verbeElement.innerHTML = verbe;
    }
    
}


const startBtn = document.getElementById("start-btn");
const verbeElement = document.getElementById("verbe-element");
const sendBnt = document.getElementById("send-btn");

const bvElement = document.getElementById("bv-element");
const preteritElement = document.getElementById("preterit-element");
const ppElement = document.getElementById("pp-element");

startBtn.addEventListener("click", start);