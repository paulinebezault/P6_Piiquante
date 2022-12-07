const mongoose = require("mongoose");
const express = require("express");
const app = express.Router();
const Sauce = require("../models/sauce"); //on importe le modèle des sauces
let user = require("../models/user");
const fs = require("fs");//donne accès aux fonctions qui permettent de modifier et supprimer les fichiers de la BDD

//première route de la base de donnée:
exports.getAllSauces = async (req, res) => {
    let saucesAll = await Sauce.find(); //récupère toutes les sauces dans la base de données

    res.send(saucesAll);
    //envoie ça à la response
};

//récupérer une sauce
exports.getOneSauce = async (req, res) => {
    let id = req.params.id //l'objet request, je prends les paramètres et je sélectionne l'id
    let sauceObject = await Sauce.findOne({
        //conditions de récupération
        _id: mongoose.Types.ObjectId(id)//précise qu'on est dans un type objectId, façon dont mongoDB stocke
    });

    res.send(sauceObject);
};

//création d'une sauce
exports.createSauce = async (req, res, next) => {
    //récupérer les paramètre du corps-body
    const sauceObject = JSON.parse(req.body.sauce);/* même si express.JSON parse les objets JSON en string, ici on en a besoin pour déclarer sauceObject*/

    //on supprime _id et _userId de l'objet Sauce pour le remplacer par le _userId extrait du token d'auth
    delete sauceObject._id;
    delete sauceObject._userId;
    const newSauce = new Sauce({//on recrée un objet Sauce en y ajoutant le nouvel userId sécurisé et l'url de l'image
        ...sauceObject, // ... opérateur de destructuration, permet de sortir les clé-valeur de leur 'boîte' pour y ajouter/supprimer des clé-valeurs, de fusionner deux objets en un seul
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    newSauce.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) });
};

//mise à jour d'une sauce
exports.updateSauce = async (req, res) => {
    const sauceObject = req.file ? {//l'objet sauceObject regarde s'il y a un file dans la requête (req.file)  
        ...req.body.sauce, //S'il y en a un, on traite la nouvelle image, en lui ajoutant une nouvelle url
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };//s'il n'y en a pas on traite simplement l'objet entrant

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })//on récupère l'objet à modifier Sauce
        .then((updatedSauce) => {//vérification que l'objet modifié appartient bien à l'user qui envoie la requete de modif
            if (updatedSauce.userId != req.auth.userId) {//si l'userId est différent(!=) du token, donc objet lui appartient pas
                res.status(403).json({ message: 'Not authorized' });
            } else {// si l'objet appartient bien à user
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })//on indique les éléments à mettre à jour, puis on les ajoute à sauceObject
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
    /* let id = req.params.id; //récupération id
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
     }*/
};

//suppression d'une sauce
exports.deleteSauce = async (req, res) => {
    Sauce.findOne({ _id: req.params.id })//on utilise l'ID reçu comme paramètre pour accéder à l'Objet correspondant dans la base de données
        .then(sauceObject => {
            if (sauceObject.userId != req.auth.userId) {//vérification que l'user faisant la requête est le propriétaire de l'objet
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = sauceObject.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    /* let id = req.params.id; //récupération id
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
     }*/
};

exports.likeDislike = (req, res, next) => {
    let like = req.body.like; //on récupère le nombre(en string) du like depuis le corps de la requête, on l'utilise ensuite avec switch
    console.log(like, "le nombre du like");
    let userId = req.auth;//on récupère l'userId dans le corps de la requete 
    console.log(userId, "l'id du user");//me donne undefined
    let sauceId = req.params.id;// on récupère la sauce via son id
    console.log(sauceId, "l'id de la sauce");

    switch (like) {
        case 1:
            Sauce.updateOne({ _id: sauceId },
                { $push: { usersLiked: userId }, $inc: { likes: +1 } }) //ajoute le userId au tableau usersLiked et incrémente le nombre de likes par 1

                .then(() => { res.status(200).json({ message: "A aimé" }) })
                .catch(error => res.status(401).json({ error }));

            break;
        case 0:

           /* usersLiked.includes(userId);
            .then(() => { res.status(200).json({ message: "A annulé son like" }) })
                .catch(error => res.status(401).json({ error }));

            usersDisliked.includes(userId);
            .then(() => { res.status(200).json({ message: "A annulé son dislike" }) })
                .catch(error => res.status(401).json({ error }));
            break;*/

        case -1:

            Sauce.updateOne({ _id: sauceId },
                { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }) //ajoute le userId au tableau usersDisliked et incrémente le nombre de dislikes par 1
                .then(() => { res.status(200).json({ message: "N'a pas aimé" }) })
                .catch(error => res.status(401).json({ error }));

            break;
    };
};

    //mise à jour du nombre total(rechargement de la page ?) à chaque notation

