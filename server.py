from flask import Flask, render_template
from pycsv import csv
import os

app = Flask(__name__)




# enumere tous les fichiers csv dans /verbes pour permettre a l'utilisateur de choisir son niveau
fichiers_verbes = []
for verbe_file in os.listdir("verbes"):
    print(verbe_file)
    fichiers_verbes.append(verbe_file)


@app.route("/")
def index():
    return render_template("index.html")




if __name__ == "__main__":
    app.run(debug=True)