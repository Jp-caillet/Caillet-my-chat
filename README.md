# caillet-my-chat

# chatBot

# Introduction

ceci est un Chat qui possede différent chatBot (youtube,uber,carrefour,hearstone)

# Pré-requis

Installer `nodejs` & `npm`

# Comment l'utiliser

`git clone https://github.com/Jp-caillet/caillet-my-chat.git`
`npm i`
`npm run start`

# Utilisation Bots

  * youtube: /ytb search [nom_de_la_video]  
liste 5 video correspondant au nom entrer.
click sur l'une de ces images pour lancer la vidéo en question.
API: https://www.npmjs.com/package/caillet-my-bot-youtube

  * uber: /uber to [nom_de_la_destination]  
trajet uber disponible, sur map, avec le prix, la distance.
API: https://www.npmjs.com/package/bot-uber

  * hearstone: /hearstone [nom_de_la_carte] ou /combat [nom_de_la_carte]/[nom_de_la_carte]
affiche l'image de la carte en question.
fait combattre la premiere carte contre la deuxieme, affiche les deux carte et nomme un vainqueur.
API: https://www.npmjs.com/package/caillet-my-bot-hearstone

  * carrefour: /carouf  
liste des carrefour proche, affiche leurs position en cliquant sur un élément de la liste
API: https://www.npmjs.com/package/caillet-my-bot-carouf
  
  * help: /help
affiche toute les commandes du chatbot

# Function


| name | params | return 
| --- | --- | --- 
| +botcombat() | message : object | null 
| +bothearstonne() | message : object | null
| +botubeur() | message : object | null
| +botcarefour() | message : object | null
| +botyoutuber() | message : object | null
| +helpeur() | message : object | null
