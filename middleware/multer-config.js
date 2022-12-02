const multer = require('multer');
/*import multer, { diskStorage } from 'multer';//<- correction donnée par vscode à ligne1*/


// on a pas accès à l'extension du fichier envoyé, 
//mais on a accès à son mime type (ex:images/jpg), donc on utilise ces mime types pour générer l'extension du fichier.
//on crée ici un dictionnaire sous forme d'objet pour indiquer à quelle extension correspond quel mime type
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({//objet de configuration de multer, indique à multer où enregistrer les fichiers entrants-> dans la machine du server
    destination: (req, file, callback) => {// fonction destination indique à multer d'enregistrer les fichiers dans le dossier 'images'
        callback(null, 'images');
    },


    filename: (req, file, callback) => {// indique à multer comment renommer le fichier utilisé (pour ne pas avoir deux fichiers avec le même nom)
        const name = file.originalname.split(' ').join('_'); //on supprime les espaces dans le nom d'origine du fichier et on les remplace par des underscores
        const extension = MIME_TYPES[file.mimetype]; //on crée l'extension via l'élément du dictionnaire qui correspond au mime type du fichier envoyé par le frontend
        callback(null, name + Date.now() + '.' + extension); //on indique avec null qu'il n'y a pas d'erreur,
        // name correspond au nom de fichier entier qu'on a créé juste au dessus, 
        //on lui rajoute un timestamp à la milliseconde près pour le rendre unique
        //on ajoute un point puis l'extention
    }
}
);

module.exports = multer({ storage }).single('image'); //on exporte le middleware en appelant la méthode multer et en lui passant l'objet storage.
// on indique qu'il s'agit d'un fichier unique (et pas d'un groupe de fichiers) avec la méthode single et qu'il s'agit d'un fichier image
