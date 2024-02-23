from flask import Flask, render_template, jsonify, request, session, redirect, url_for, send_from_directory
from pycsv import csv
import os
import random
from urllib.parse import quote

app = Flask(__name__)

# enumere tous les fichiers csv dans /verbes pour permettre a l'utilisateur de choisir son niveau
fichiers_verbes = {}
for verbe_file in os.listdir("verbes"):
    if verbe_file.endswith(".csv"):
        print(verbe_file)
        fichiers_verbes[verbe_file.replace(".csv", "")] = csv().load_file("verbes/" + verbe_file)
        

def choisir_questions(fichiercsv : csv, nb: int = 10) -> list:
    questions = []
    while len(questions) != nb or len(questions) == len(fichiercsv.table):
        verbe = random.choice(fichiercsv.table)
        if not verbe in questions:
            questions.append(verbe)
    return questions

def generer_cle(randrange: tuple = (15, 25)) -> str:
    chars = """abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""
    nb = random.randint(*randrange)
    return "".join(random.choice([c for c in chars]) for _ in range(nb))
    

def xor_crypt(message: str, cle: str) -> str:
    """Encrypte ou décrypte le message avec XOR a partir de la clé message ⊕ cle"""
    message_code = "" # Initialise la variable du message
    for i in range(len(message)):
        # Ajouter au message codé le caratere de la valeur la fonction XOR entre le caratere du message et son correspondant dans la clé
        message_code += chr(ord(message[i]) ^ ord(cle[i % len(cle)]))

    return message_code

def crypt_talbe(table: list[list[str]], key = str):
    new_table = []
    for line in table:
        new_line = []
        for case in line:
            new_line.append(xor_crypt(case, key))
        new_table.append(new_line)
    
    return new_table
    
### Fonctions Internes au programme

@app.route("/internal/select-file")
def select_file():
    """selectionne le fichier a utiliser pour quetionner les verbes irreguliers"""
    file = request.args.get('file')
    

@app.route("/src/<path:path>")
def style(path):
    return send_from_directory('static', path)



@app.route("/index.js")
def index_js():
    return send_from_directory('templates', 'index.js')



### Fonctions publques

@app.route("/test/<verbesfile>")
def run(verbesfile):
    """Lance le programme avec le fichier / niveau choisisss"""
    if verbesfile in fichiers_verbes:
        cle = generer_cle()
        verbes = choisir_questions(fichiers_verbes[verbesfile])
        verbes_crypted = str(crypt_talbe(verbes, cle))
        return render_template("test.html", verbes=verbes_crypted, key=cle)
    return redirect("/")



@app.route("/")
@app.route("/index")
@app.route("/index.html")
@app.route("/home")
def index():
    return render_template("index.html", levels = fichiers_verbes)

if __name__ == "__main__":
    app.run(debug=True)
