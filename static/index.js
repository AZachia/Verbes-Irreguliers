// index.js
// fichier javascript pour la page test.html

function xor_crypt(message, cle) {
    // fonction pour décrypter les verbes avec la clé
    var message_code = '';
    for (let i = 0; i < message.length; i++) {
        message_code += String.fromCharCode(message.charCodeAt(i) ^ cle.charCodeAt(i % cle.length));
    }
    return message_code;
}


function inputChange() {
    // detexte les changements dans les inputs et change le texte du bouton en fonction
    if (bvElement.value === "" && preteritElement.value === "" && ppElement.value === "") {
        // si les inputs sont vides on change le texte du bouton en "Pass"
        sendBnt.innerHTML = "Pass"
    }
    else {
        // si les inputs ne sont pas vides on change le texte du bouton en "Send"
        sendBnt.innerHTML = "Send"
    }
}


function FormatTime(time) {
    // fonction pour formater le temps sous le format mm:ss

    var minutes = Math.floor(time / 60000);
    var seconds = Math.floor((time % 60000) / 1000);

    // formater le temps
    var formattedTime = (minutes < 10 ? "0" : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

    return formattedTime;
}


function updatetimer() {
    // Met à jour le timer toutes les 500ms
    if (continueCountTime) {
        var currentTime = Date.now();
        timer.innerHTML = FormatTime(currentTime - starttime);
        setTimeout(updatetimer, 500)
    }


}


function CheatDetected(event) {
    // Détecte si l'utilisateur change d'onglet ou minimise la fenêtre pour afficher un message de triche
    // et lui demander de retourner sur la page d'accueil
    if (!(document.visibilityState == "visible")) {
        let cheatdiv = document.getElementById("cheat-detected");
        testdiv.style.display = "none";
        cheatdiv.style.display = "flex";
    }
}


function start() {
    // Commence le test

    // afficher la zone de test
    startdiv.style.display = "none";
    testdiv.style.display = "flex";

    // afficher le premier verbe
    verbe = xor_crypt(verbes[currentQuestion][0], key);
    verbeElement.innerHTML = verbe;

    // démarer le timer
    starttime = Date.now();
    timer.innerHTML = "00:00";
    updatetimer();

    // afficher le numéro de la question
    questionNumber.innerHTML = "Question " + (currentQuestion + 1) + " / " + verbes.length;

    // ajoute les écouteurs d'événements pour les inputs
    let inputs = [bvElement, preteritElement, ppElement];
    for (let i = 0; i < inputs.length; i++) {
        // appel de la fonction inputChange quand l'utilisateur tape dans les inputs
        inputs[i].addEventListener("keyup", inputChange)

        // quand l'utilisateur appuie sur "Enter" on passe à l'input suivant
        inputs[i].addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                // si la touche appuyée est "Enter"
                event.preventDefault();
                // si l'intput actuel n'est pas le dernier, on passe à l'input suivants
                if (i + 1 < inputs.length) {
                    inputs[i + 1].focus();
                }
                // sinon on passe à la question suivante
                else {
                    AskQuestion();
                }
            }
        });
    }

    // activer la détection de triche
    document.addEventListener("visibilitychange", CheatDetected);

    // quand l'utilisateur clique sur le bouton "Send" on passe à la question suivante
    sendBnt.addEventListener("click", AskQuestion);


}


function showResult() {
    // Affiche les résultats du test et le score

    enddiv.style.display = "none";
    resultdiv.style.display = "flex";

    let reponseTalbe = document.getElementById("reponse-talbe");
    var score = 0;

    let messages = [];

    // parcourir les réponses et les verbes pour les afficher à l'utilisateur
    for (let i = 0; i < responses.length; i++) {
        // créer une nouvelle ligne dans le tableau
        let tr = document.createElement("tr");

        // Synthèse vocale: si le navigateur supporte la synthèse vocale, on ajoute un bouton pour lire les réponses à voix haute
        // Voir https://developer.mozilla.org/fr/docs/Web/API/Web_Speech_API
        if ('speechSynthesis' in window) {

            // generer le texte à lire
            let textmessage = "";
            for (let j = 0; j < 3; j++) {
                textmessage += xor_crypt(verbes[i][j + 1], key).split("/")[0] + " ";
            }

            // créer un nouvel objet SpeechSynthesisUtterance et le paramétrer
            var msg = new SpeechSynthesisUtterance(textmessage);
            msg.lang = "en-US"; // langue
            msg.rate = 0.6; // vitesse de lecture

            // ajouter le message à la liste des messages
            messages.push(msg);

            // créer un bouton pour lire le message à voix haute
            let speakBtn = document.createElement("button");
            speakBtn.innerHTML = "<span class='material-symbols-outlined'>hearing</span> ";
            speakBtn.classList.add("speak-button")

            // quand le bouton est cliqué, on lit le message à voix haute
            speakBtn.addEventListener("click", function () {
                window.speechSynthesis.speak(messages[i]);
            });

            // ajouter le bouton à la ligne
            tr.appendChild(speakBtn);

        }

        // ajouter le numéro de la question à la ligne
        let rownumber = document.createElement("td");
        rownumber.innerHTML = i + 1 + ".";
        tr.appendChild(rownumber);

        // ajouter le verbe à la ligne
        let verbecase1 = document.createElement("td");
        verbecase1.innerHTML = xor_crypt(verbes[i][0], key);
        tr.appendChild(verbecase1);

        // pour chaque forme du verbe, ajouter une case au tableau
        for (let j = 0; j < 3; j++) {
            // créer une nouvelle case
            let newtd = document.createElement("td");

            // ajouter le texte de la réponse à la case si la réponse n'est pas vide, sinon ajouter un symbole vide
            let textcontent = responses[i][j] === "" ? '<span class="material-symbols-outlined">cancel</span>' : responses[i][j];
            newtd.innerHTML = textcontent;

            // vérifier si la réponse est correcte
            let isCorrect = false;

            // si la réponse est correcte
            if (responses[i][j].toLowerCase() === xor_crypt(verbes[i][j + 1], key).toLocaleLowerCase()) {
                isCorrect = true;
            }

            // si la réponse contient un /, on vérifie si une des réponses est correcte
            if (xor_crypt(verbes[i][j + 1], key).includes("/")) {
                let corrects = xor_crypt(verbes[i][j + 1], key).split("/");
                if (corrects.includes(responses[i][j].toLowerCase())) {
                    isCorrect = true;
                }
            }

            if (isCorrect) {
                // Si la réponse est correcte, on affiche en vert, et on ajoute 1 au score
                newtd.style.color = "#32CD32";
                score += 1;
            }
            else {
                // Si la réponse est incorrecte on l'affiche en rouge et on ajoute la réponse correcte entre parenthèses
                newtd.style.color = "red";
                let responsespan = document.createElement("span");
                responsespan.innerHTML += " (" + xor_crypt(verbes[i][j + 1], key) + ")";
                responsespan.style.color = "black";
                newtd.appendChild(responsespan)
            }

            // ajouter la case à la ligne
            tr.appendChild(newtd);



        }
        // ajouter la ligne au tableau
        reponseTalbe.appendChild(tr);
    }

    // afficher le score
    let scoreH2 = document.getElementById("score-h2");
    scoreH2.innerHTML = "Votre score: " + score + " / " + verbes.length*3;

    // afficher le temps
    let timeP = document.getElementById("time-p");
    timeP.innerHTML = "Votre temps: " + FormatTime(EndTime - starttime);

}

function AskQuestion() {
    // passe à la question suivante

    // Ajouter les réponses de l'utilisateur à la liste des réponses
    responses.push([bvElement.value, preteritElement.value, ppElement.value]);

    // Vider les inputs
    bvElement.value = "";
    preteritElement.value = "";
    ppElement.value = "";
    sendBnt.innerHTML = "Pass";

    currentQuestion += 1;

    // Si on a pas encore fini le test, on pose la question suivante
    if (currentQuestion < verbes.length) {
        // Mettre à jour le numéro de la question
        questionNumber.innerHTML = "Question " + (currentQuestion + 1) + " / " + verbes.length;

        // Afficher le nouveau verbe
        let verbe = xor_crypt(verbes[currentQuestion][0], key);
        verbeElement.innerHTML = verbe;
        bvElement.focus();
    }
    // Sinon on affiche les résultats
    else {
        EndTime = Date.now();
        testdiv.style.display = "none";
        enddiv.style.display = 'flex';
        seeResultsBtn.focus();
        document.removeEventListener("visibilitychange", CheatDetected);
        seeResultsBtn.addEventListener("click", showResult);
    }
}


// récupère les boutons qui change la partie active de la page
const startBtn = document.getElementById("start-btn");
const verbeElement = document.getElementById("verbe-element");
const sendBnt = document.getElementById("send-btn");
const seeResultsBtn = document.getElementById("see-results-btn");

// récupère les inputs pour les réponses
const bvElement = document.getElementById("bv-element");
const preteritElement = document.getElementById("preterit-element");
const ppElement = document.getElementById("pp-element");

// récupère les parties de la page pour les différentes parties de la page
const startdiv = document.getElementById("start-div");
const testdiv = document.getElementById("test-div");
const enddiv = document.getElementById("end-div");
const resultdiv = document.getElementById("result-div");

// récupère les éléments pour afficher le numéro de la question et le timer
const questionNumber = document.getElementById("question-number");
const timer = document.getElementById("timer");

// initialisation des variables
var starttime = Date().now; // temps de début du test
var continueCountTime = true; // variable pour savoir si on doit continuer à chronométrer

var currentQuestion = 0; // numéro de la question actuelle
var responses = []; // array pour stocker les réponses

let EndTime = 0; // temps de fin du test

// Commence le test quand on clique sur le bouton
startBtn.addEventListener("click", start);