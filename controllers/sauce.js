const mongoose=require("mongoose");
const express = require("express");
const app = express.Router();
const Sauce = require("../models/sauce"); //on importe le modèle des sauces

//première route de la base de donnée:
exports.getAllSauces = async(req,res)=>{
    let sauces= await Sauce.find(); //récupère toutes les sauces dans la base de données
    console.log(sauces);
    res.send(sauces);
    //envoie ça à la response
};

//récupérer une sauce
exports.getOneSauce =async(req,res)=>{
    let id= req.params.id //l'objet request, je prends les paramètres et je sélectionne l'id
    let sauce= await Sauce.findOne({
        //conditions de récupération
        _id: mongoose.Types.ObjectId(id)//précise qu'on est dans un type objectId, façon dont mongoDB stocke
    }); 
    console.log(sauce);
    res.send(sauce);
};

//création d'une sauce
exports.createSauce = async(req,res)=>{
    //récupérer les paramètre du corps/body
    let body=req.body;
    let sauce=await Sauce.create(body);
    if(sauce){
        res.send({
            message: "Sauce créée"
        })
    }else{
        res.send({
            message: "Erreur de création"
        })
    }
};

//mise à jour d'une sauce
exports.updateSauce = async(req,res)=>{
    let id= req.params.id; //récupération id
    let body=req.body;//récupération info du body
    let updatedSauce=await Sauce.updateOne({
        _id: mongoose.Types.ObjectId(id)
    },body);
    if(updatedSauce){
        res.send({
            message: "Sauce mise à jour"
        })
    }else{
        res.send({
            message: "Erreur de mise à jour"
        })
    }
};

//suppression d'une sauce
exports.deleteSauce = async(req,res)=>{
    let id= req.params.id; //récupération id
    let deletedSauce= await Sauce.deleteOne({
        _id: mongoose.Types.ObjectId(id)
    });
    //vérification
    if(deletedSauce){
        res.send({
            message: "Sauce supprimée"
        })
    }else{
        res.send({
            message: "Erreur de suppression"
        })
    }
};
