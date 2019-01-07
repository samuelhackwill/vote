import { Mongo } from 'meteor/mongo'

Users = new Mongo.Collection('users');
// ça c'est la collection qui vient du google spreadsheet
// tu vois? c'est les usagers et la combinaison email / nom d'utilisateur
// permettant de dévérouiller les bails.

Vote = new Mongo.Collection("vote");
// ça c'est la collection qui dit si les gens sont visibles ou non
// et également si ils disent oui ou non

BannedChairs = new Mongo.Collection("bannedChairs");