const mongoose=require("mongoose");
const express = require("express");
const app = express.Router();
const Sauce = require("../models/sauce");
const saucesCtrl = require("../controllers/sauce");//importe le controller (route du fichier) et on le nomme saucesCtrl

//première route de la base de donnée:
app.get("/",saucesCtrl.getAllSauces);//on va chercher dans le fichier controller la fonction précise qu'on veut avec notation dot

//récupérer une sauce
app.get("/:id",saucesCtrl.getOneSauce);

//création d'une sauce
app.post("/",saucesCtrl.createSauce);

//mise à jour d'une sauce
app.put("/:id",saucesCtrl.updateSauce);

//suppression d'une sauce
app.delete("/:id",saucesCtrl.deleteSauce);

module.exports = app;