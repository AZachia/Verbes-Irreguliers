from flask import Flask, render_template, jsonify, request, session, redirect, url_for, send_from_directory
from pycsv import csv
import os
import random

app = Flask(__name__)

# enumere tous les fichiers csv dans /verbes pour permettre a l'utilisateur de choisir son niveau
fichiers_verbes = {}
for verbe_file in os.listdir("verbes"):
    if verbe_file.endswith(".csv"):
        print(verbe_file)
        fichiers_verbes[verbe_file.replace(".csv", "")] = csv().load_file("verbes/" + verbe_file)
        

def choisir_questions(fichiercsv : csv, nb: int = 10) -> list:
    questions = []
    while len(questions) != nb:
        verbe = random.choice(fichiercsv.table)
        if not verbe in questions:
            questions.append(verbe)
    return questions
    
    
### Fonctions Internes au programme

@app.route("/internal/select-file")
def select_file():
    """selectionne le fichier a utiliser pour quetionner les verbes irreguliers"""
    file = request.args.get('file')
    
@app.route("/src/style.css")
def style():
    return send_from_directory('static', 'style.css')


@app.route("/index.js")
def index_js():
    return send_from_directory('templates', 'index.js')



### Fonctions publques

@app.route("/run/<verbesfile>")
def run(verbesfile):
    """Lance le programme avec le fichier / niveau choisisss"""
    if verbesfile in fichiers_verbes:
        return render_template("run.html", questions=choisir_questions(fichiers_verbes[verbesfile]))
    return redirect("/")



@app.route("/")
@app.route("/index")
@app.route("/index.html")
@app.route("/home")
def index():
    return render_template("index.html", levels = fichiers_verbes)

if __name__ == "__main__":
    app.run(debug=True)
