const mongoose=require("mongoose");
const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user'); //pour associer le controlleur aux différentes routes

router.post('/signup', userCtrl.signup); //routes post car le frontend enverra des informations (adresse mail et mdp)
router.post('/login', userCtrl.login);

module.exports = router;