const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//création de schéma
const sauceSchema = new mongoose.Schema({
    //ici on détaille les différents champs du schema
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl : String,
    heat : Number,
    likes : Number,
    dislikes : Number
}); //ce schéma là sera composé de ces champs là

sauceSchema.plugin(uniqueValidator); //ajout du plugin mongoose-unique-validator pour être sûr que mongoDB lise bien l'argument "unique"
//s'assure que deux utilisateurs ne peuvent pas utiliser la même adresse email

//création de modèle (liaison entre le schéma et une collection)
module.exports = mongoose.model("Sauce", sauceSchema); //on exporte le modèle 
//liaison faite. ici S majuscule, convention dans ce cas*
//l'ajoute à mon installation/instance de mongoose
