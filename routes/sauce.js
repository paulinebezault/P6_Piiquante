const mongoose = require("mongoose");
const express = require("express");
const app = express.Router();
const auth = require("../middleware/auth"); 
//importation middleware d'authentification, ajout AVANT les gestionnaires de routes
const Sauce = require("../models/sauce");
const multer = require("../middleware/multer-config"); 
//ajouté entre middleware d'authentification et gestion des routes post et put, 
//pour que auth fasse la vérif token en amont
const saucesCtrl = require("../controllers/sauce");
//importe le controller (route du fichier) et on le nomme saucesCtrl

//première route de la base de donnée:
app.get("/", auth, saucesCtrl.getAllSauces);
//on va chercher dans le fichier controller la fonction précise qu'on veut avec notation dot

//récupérer une sauce
app.get("/:id", auth, saucesCtrl.getOneSauce);

//création d'une sauce
app.post("/", auth, multer, saucesCtrl.createSauce);

//mise à jour d'une sauce
app.put("/:id", auth, multer, saucesCtrl.updateSauce);

//suppression d'une sauce
app.delete("/:id", auth, saucesCtrl.deleteSauce);

//like et dislike
app.post("/:id/like", auth, saucesCtrl.likeDislike);

module.exports = app;