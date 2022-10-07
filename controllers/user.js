const bcrypt = require("bcrypt"); //package de cryptage des mots de passe
const express = require("express");

//middlewares d'authentification
exports.signup = async(req, res, next) => { //fonction d'enregistrement des utilisateurs
 //hashage du mot de passe, fonction asynchrone
 const hash = await bcrypt.hash(req.body.password, 10);
 console.log("mot de passe",req.body.password);
 console.log("hashage",hash);
 return; //éxécution de la fonction terminée
 //ajout de l'utilisateur à la base de donnée
};

exports.login = (req, res, next) => { //fonction de connexion d'utilisateurs enregistrés

};