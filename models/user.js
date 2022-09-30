const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },//unique pour avoir une inscription unique par email
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //ajout du plugin mongoose-unique-validator pour être sûr que mongoDB lise bien l'argument "unique"
//s'assure que deux utilisateurs ne peuvent pas utiliser la même adresse email

module.exports = mongoose.model('User', userSchema); //on exporte le modèle 