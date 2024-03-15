# Importer les librairies nécessaires
try:
    from flask import Flask, render_template, redirect
except ImportError as e:
    raise ImportError("Veuillez installer la librairie Flask avec la commande 'pip install flask'. Détails de l'erreur: " + str(e))
import os
import random

# Créer une application Flask
app = Flask(__name__)

def csv_to_list(path: str, sep:str = ";") -> list:
    """Convertit un fichier csv en liste"""
    table = []
    with open(path, "r", encoding="utf-8") as file:
        for line in file.readlines():
            if line != "":
                table.append(line.replace("\n", "").split(sep))
    return table

# énumère tous les fichiers csv dans /verbes pour permettre à l'utilisateur de choisir son niveau
fichiers_verbes = {}
for verbe_file in os.listdir("verbes"):
    if verbe_file.endswith(".csv"):
        print(verbe_file)
        fichiers_verbes[verbe_file.replace(".csv", "")] = csv_to_list("verbes/" + verbe_file)
        

def choisir_questions(fichiercsv: list, nb: int = 10) -> list:
    """Choisit aléatoirement des questions dans un fichier csv

    Args:
        fichiercsv (list): le fichier csv à partir duquel choisir les questions
        nb (int, optional): le nonbre de question a choisir Defaults to 10.

    Returns:
        list: la liste des questions choisies
    """
    questions = []
    while len(questions) != nb or len(questions) == len(fichiercsv):
        verbe = random.choice(fichiercsv)
        if not verbe in questions:
            questions.append(verbe)
    return questions

def generer_cle(randrange: tuple|list = (15, 25)) -> str:
    """Génère une clé aléatoire de longueur aléatoire entre 15 et 25 caractères"""
    chars = """abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"""
    nb = random.randint(*randrange)
    return "".join(random.choice([c for c in chars]) for _ in range(nb))
    

def xor_crypt(message: str, cle: str) -> str:
    """Encrypte ou décrypte le message avec XOR à partir de la clé (message ⊕ cle)"""
    message_code = "" # Initialise la variable du message
    for i in range(len(message)):
        # Ajouter au message codé le caratère de la valeur la fonction XOR entre le caratère du message et son correspondant dans la clé
        message_code += chr(ord(message[i]) ^ ord(cle[i % len(cle)]))

    return message_code

def crypt_talbe(table: list[list[str]], key = str) -> list:
    """Encrypte une table de messages avec XOR à partir de la clé (message ⊕ cle)"""
    new_table = []
    for line in table:
        new_line = []
        for case in line:
            new_line.append(xor_crypt(case, key))
        new_table.append(new_line)
    
    return new_table

### Fonctions publiques
@app.errorhandler(404)
def not_found(err):
    """Affiche la page 404.html si la page demandée n'existe pas"""
    return render_template("404.html")

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
    """Page d'accueil du site web qui permet de choisir le niveau de verbes à tester"""
    return render_template("index.html", levels = fichiers_verbes)


if __name__ == "__main__":
    # Lancer le serveur Flask
    app.run()
