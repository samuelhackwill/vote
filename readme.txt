TODO : 
> affiche le nom du député en mouseover (document.getElementById(event.target).parentNode.id) ou un truc comme ça
> grogn les erreurs au lancement ça doit être dû aux helpers qui attendent pas que les data soient prètes pour envoyer du bois. iron router pour régler le problème?
> sécuriser l'application lol

MISE EN PLACE DES BAILS :
il faut déjà remettre la fonction que j'ai "planqué" dans secret.js
et balancer un bon gros getAllCreds(). (ça peuple la DB User qui est planquée sur le serveur avec tous les gens de ma news envoyé par l'API de google shitz)

puis il faut peupler 36 fois la DB vote comme suit
>>>> Vote.insert({name:"M0", connected:false, cookie:"", yorn:false})
>>>> Vote.insert({name:"M1", connected:false, cookie:"", yorn:false})
>>>> Vote.insert({name:"M2", connected:false, cookie:"", yorn:false})
etc