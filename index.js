//importer mongoose
const mongoose = require("mongoose");
require("dotenv").config();
const{USER,PASSWORD,CLUSTER}= process.env;
//créer un serveur API
const express = require("express");//on va chercher la librairie express
const app = express();//on initialise express dans la variable app, on crée une application express
app.use(express.json())//accepte de recevoir du JSON
const path = require('path'); 
const routeSauce = require("./routes/sauce");
const routeUser = require("./routes/user");
const mongoDB = `mongodb+srv://${USER}:${PASSWORD}@${CLUSTER}/Piiquante`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB connection error"));//alerte si on arrive pas à se connecter


app.use ((req,res,next) =>{ //middleware de correction d'erreur de CORS
    //accès autorisé à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    //ajoute les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With, Content, Accept, Content-Type, Authorization');
    //permet d'envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use("/api/sauces", routeSauce);//toutes les routes qui commences par "api/sauces" sont redirigées vers le fichiers routes sauce.js
app.use("/api/auth", routeUser);


app.listen(3000, () => {
    console.log("serverlisten3000")
}); //écoute tel port et lance-toi sur tel port, l'api se lance sur 3000