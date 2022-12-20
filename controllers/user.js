const bcrypt = require("bcrypt"); //package de cryptage des mots de passe
const express = require("express");

const jwt = require('jsonwebtoken');
let User = require("../models/user");//attention à ne pas mettre en constante 

//middlewares d'authentification
exports.signup = async (req, res, next) => { //fonction d'enregistrement des utilisateurs
    //hashage du mot de passe, fonction asynchrone
    const hash = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
        email: req.body.email,
        password: hash
    }); //création d'une nouvelle instance du modele User

    newUser.save() //enregistrement dans la base de donnée
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    return; //exécution de la fonction terminée
    //ajout de l'utilisateur à la base de donnée

};

exports.login = async (req, res, next) => { //fonction de connexion d'utilisateurs enregistrés
    const signedUpUser = await User.findOne({ email: req.body.email });

    if (!signedUpUser) {//on recherche la présence dans la base de donnée de l'email donné 
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });//si email pas trouvé
    };

    //on compare le mdp donné avec le hash de la base de donnée
    const passwordTested = await bcrypt.compare(req.body.password, signedUpUser.password); 
    if (!passwordTested) {
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
    } else {
        return res.status(200).json({
            userId: signedUpUser._id,
            token: jwt.sign(
                // on appelle la fonction sign de jwt avec les arguments suivants: payload (les données qu'on veut encoder)
                { userId: signedUpUser._id },// objet userId que la requête correspond à ce userId
                'RANDOM_TOKEN_SECRET', //clé secrète pour l'encodage
                { expiresIn: '24h' } //durée de validité du token avant une reconnexion nécessaire
            )

        })
    };
};

