//créer un serveur API
const express=require("express")//on va chercher la librairie express
const app=express()//on initialise express dans la variable app, on crée une application express

//première route:
app.get("/api/sauces",(req,res)=>{
    res.send("liste des sauces")//envoie ça à la response
})
app.listen(3000,()=>{
    console.log("serverlisten3000")
}) //écoute tel port et lance-toi sur tel port, l'api se lance sur 8080