# Verbes-Irrélguliers

<img src="https://skillicons.dev/icons?i=py,js,html,css&perline=12" />

**Site web qui permet d'interoger un utilisateur sur 10 verbes irréguliers.**


![](./assets/image.png)


# 🛠️ Instalation

Pour installer l'application sur votre machine, il suffit de telecharger en zip le code, installer la librairie de serveur python Flask dans le terminal avec la commande `pip install Flask`.
Pour démarer le serveur, il faut executer lancer le fichier `server.py`. Pour voir le site, rendez vous a l'adresse [27.0.0.1:5000](27.0.0.1:5000) dans votre navigateur.

Sinon, vous pouvez utiliser l'application directement dans voter navigateur en vous rendant a l'adresse **[verbes-irrelguliers.vercel.app ↗️](https://verbes-irrelguliers.vercel.app/)**


# Fonctionement

Utilise un serveur en python reposant sur la libraire Flask, et sur du javascript pour le coté client.

# 💡 Problèmes rencontrés

## Protection des réponses
Quand la liste de verbe est envoyée au client pour faire le teste, elle aparait clairement dans le code source de la page, il était donc très facile de tricher et de s'en servir.

Pour regler le problème, nous avons décidé de crypter les réponces envoyées et de les décrypter quand le programme a besoin de les utiliser. 

Nous avons donc utilisé la technique de cryptage `Xor`, qui a été implementée sur le serveur en python pour le cryptage des réponses et en javascript du coté client pour les décrypter.

Nous n'avons pas dirrectement décrypter la lsite en entier du coté client car sinon elle aurait dirrectement été accesible via la console javascript du navigateur.

Voici un morceau liste avant/après enctyption:


```js
["répandre", "spread", "spread", "spread"]
```

devient: 

```js
["\u0013¤\u0005''\u0006\u0016R", "\u0012=\u0007#(\u0006", "\u0012=\u0007#(\u0006", "\u0012=\u0007#(\u0006"]
```


