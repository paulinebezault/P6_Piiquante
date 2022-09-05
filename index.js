//importer mongoose
const mongoose=require("mongoose");

//créer un serveur API
const express=require("express");//on va chercher la librairie express
const app=express();//on initialise express dans la variable app, on crée une application express
const mongoDB="mongodb+srv://paulineadmin:Bm7g7y21FWxCkXHz@cluster0.ojrofc9.mongodb.net/Piiquante";
mongoose.connect(mongoDB,{useNewUrlParser:true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"mongoDB connection error"));//alerte si on arrive pas à se connecter

//création de schéma
const sauceSchema = new mongoose.Schema({
    //ici on détaille les différents champs du schema
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl : String,
    heat : Number,
    likes : Number,
    dislikes : Number
}); //ce schéma là sera composé de ces champs là

//création de modèle (liaison entre le schéma et une collection)
const Sauce = mongoose.model("Sauce", sauceSchema);//liaison faite. ici S majuscule, convention dans ce cas

//création d'une nouvelle sauce.
/*const firstSauce = Sauce.create({
    name: "sauce n°1",
    description: "sauce à la tomate"
});*/

//première route de la base de donnée:
app.get("/api/sauces",async(req,res)=>{
    let sauces= await Sauce.find(); //récupère toutes les sauces dans la base de données
    console.log(sauces);
    res.send(sauces);
    //envoie ça à la response
});
app.get("/api/sauces/:id",async(req,res)=>{
    let id= req.params.id //l'objet request, je prends les paramètres et je sélectionne l'id
    let sauce= await Sauce.findOne({
        //conditions de récupération
        _id: mongoose.Types.ObjectId(id)//précise qu'on est dans un type objectId, façon dont mongoDB stocke
    }); 
    console.log(sauce);
    res.send(sauce);
    
});
app.listen(3000,()=>{
    console.log("serverlisten3000")
}); //écoute tel port et lance-toi sur tel port, l'api se lance sur 8080