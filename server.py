from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from pycsv import csv
import os

app = Flask(__name__)

# enumere tous les fichiers csv dans /verbes pour permettre a l'utilisateur de choisir son niveau
fichiers_verbes = {}
for verbe_file in os.listdir("verbes"):
    print(verbe_file)
    fichiers_verbes[verbe_file.replace(".csv", "")] = csv().load_file("verbes/" + verbe_file)
    
    
### Fonctions Internes au programme

@app.route("/internal/select-file")
def select_file():
    """selectionne le fichier a utiliser pour quetionner les verbes irreguliers"""
    file = request.args.get('file')



### Fonctions publques

@app.route("/run/<verbesfile>")
def run(verbesfile):
    """Lance le programme avec le fichier / niveau choisisss"""
    if verbesfile in fichiers_verbes:
        return "c'est bon: " + verbesfile
    return redirect("/")



@app.route("/")
@app.route("/home")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)