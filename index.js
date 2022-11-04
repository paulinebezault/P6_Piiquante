//importer mongoose
const mongoose = require("mongoose");

//créer un serveur API
const express = require("express");//on va chercher la librairie express
const app = express();//on initialise express dans la variable app, on crée une application express
app.use(express.json())//accepte de recevoir du JSON
const path = require('path'); //??
const routeSauce = require("./routes/sauce");
const routeUser = require("./routes/user");
const mongoDB = "mongodb+srv://paulineadmin:Bm7g7y21FWxCkXHz@cluster0.ojrofc9.mongodb.net/Piiquante";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB connection error"));//alerte si on arrive pas à se connecter

//création d'une nouvelle sauce.
/*const firstSauce = Sauce.create({
    name: "sauce n°1",
    description: "sauce à la tomate"
});*/
app.use("/api/sauces", routeSauce);//toutes les routes qui commences par "api/sauces" sont redirigées vers le fichiers routes sauce.js
app.use("/api/auth", routeUser);
app.use('/images', express.static(path.join(__dirname, 'images')));//??

app.listen(3000, () => {
    console.log("serverlisten3000")
}); //écoute tel port et lance-toi sur tel port, l'api se lance sur 8080