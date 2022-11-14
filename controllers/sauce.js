const mongoose = require("mongoose");
const express = require("express");
const app = express.Router();
const Sauce = require("../models/sauce"); //on importe le modèle des sauces

//première route de la base de donnée:
exports.getAllSauces = async (req, res) => {
    let sauces = await Sauce.find(); //récupère toutes les sauces dans la base de données
    console.log(sauces);
    res.send(sauces);
    //envoie ça à la response
};

//récupérer une sauce
exports.getOneSauce = async (req, res) => {
    let id = req.params.id //l'objet request, je prends les paramètres et je sélectionne l'id
    let sauce = await Sauce.findOne({
        //conditions de récupération
        _id: mongoose.Types.ObjectId(id)//précise qu'on est dans un type objectId, façon dont mongoDB stocke
    });
    console.log(sauce);
    res.send(sauce);
};

//création d'une sauce
exports.createSauce = async (req, res) => {
    //récupérer les paramètre du corps/body
    let body = req.body;
    let sauce = await Sauce.create(body);

    //express.JSON parse les objets JSON en string
    //on supprime _id et _userId de l'objet Sauce pour le remplacer par le _userId extrait du token d'auth
    delete Sauce._id;
    delete Sauce._userId;
    const Sauce = new Sauce({//on recrée un objet Sauce en y ajoutant le nouvel userId sécurisé et l'url de l'image
        ...Sauce, // ... opérateur de destructuration, permet de sortir les clé-valeur de leur 'boîte' pour y ajouter/supprimer des clé-valeurs, de fusionner deux objets en un seul
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })

   /* if (sauce) {
        res.send({
            message: "Sauce créée"
        })
    } else {
        res.send({
            message: "Erreur de création"
        })
    };*/
};

//mise à jour d'une sauce
exports.updateSauce = async (req, res) => {
    let id = req.params.id; //récupération id
    let body = req.body;//récupération info du body
    let updatedSauce = await Sauce.updateOne({
        _id: mongoose.Types.ObjectId(id)
    }, body);
    if (updatedSauce) {
        res.send({
            message: "Sauce mise à jour"
        })
    } else {
        res.send({
            message: "Erreur de mise à jour"
        })
    }
};

//suppression d'une sauce
exports.deleteSauce = async (req, res) => {
    let id = req.params.id; //récupération id
    let deletedSauce = await Sauce.deleteOne({
        _id: mongoose.Types.ObjectId(id)
    });
    //vérification
    if (deletedSauce) {
        res.send({
            message: "Sauce supprimée"
        })
    } else {
        res.send({
            message: "Erreur de suppression"
        })
    }
};
