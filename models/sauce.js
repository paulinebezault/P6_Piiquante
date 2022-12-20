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
    dislikes : Number,
    usersLiked: ["String <userId>"],
    usersDisliked: ["String <userId>"]
}); //ce schéma là sera composé de ces champs là

sauceSchema.plugin(uniqueValidator); 

//création de modèle (liaison entre le schéma et une collection)
module.exports = mongoose.model("Sauce", sauceSchema); //on exporte le modèle 
//liaison faite. ici S majuscule, convention dans ce cas*
//l'ajoute à mon installation/instance de mongoose

