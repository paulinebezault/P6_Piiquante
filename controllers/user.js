const bcrypt = require("bcrypt"); //package de cryptage des mots de passe
const express = require("express");

const jwt = require('jsonwebtoken');
let user = require("../models/user");//attention à ne pas mettre en constante 

//middlewares d'authentification
exports.signup = async (req, res, next) => { //fonction d'enregistrement des utilisateurs
    //hashage du mot de passe, fonction asynchrone
    const hash = await bcrypt.hash(req.body.password, 10);
    console.log("mot de passe", req.body.password);
    console.log("hashage", hash);

    const newUser = new user({
        email: req.body.email,
        password: hash
    }); //création d'une nouvelle instance du modele User

    newUser.save() //enregistrement dans la base de donnée
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));

    console.log("user créé", newUser);
    return; //éxecution de la fonction terminée
    //ajout de l'utilisateur à la base de donnée
};

exports.login = async (req, res, next) => { //fonction de connexion d'utilisateurs enregistrés
    const signedUpUser = await user.findOne({ email: req.body.email });
    const match = bcrypt.compare(req.body.password, hash, signedUpUser.password);
    if (!match) {
        return res.json({ message: 'Paire login/mot de passe incorrecte' });
    } else {
        return res.json({
            userId: user._id,
            token: jwt.sign(// on appelle la fonction sign de jwt avec les arguments suivant: payload (les données qu'on veut encoder)
                { userId: user._id },// objet userId que la requête correspond à ce userId
                'RANDOM_TOKEN_SECRET', //clé secrète pour l'encodage
                { expiresIn: '24h' } //durée de validité du token avant une reconnexion nécessaire
            )
        });
    };
};

/*
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };
  
 try {
        const value = await greeting;
        console.log("The Promise is resolved!", value);
      } catch((error) {
        console.error("The Promise is rejected!", error);
      } finally {
        console.log(
          "The Promise is settled, meaning it has been resolved or rejected."
        );
      }*/