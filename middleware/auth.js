const jwt = require("jsonwebtoken"); //on importe jsonwebtoken

module.exports = (req, res, next) => { //on exporte notre fonction middleware
    //récupération, décodage et vérification du token, transmission aux autres middleware et gestionnaires de routes
    try {
        const token = req.headers.authorization.split(' ')[1];//on split le header pour enlever la première partie 'bearer' et ne garder que la deuxième partie du token
        const decodedToken = jwt.verify(token,'RANDOM_TOKEN_SECRET'); //on décode le token récupéré, si erreur on passe dans le catch
        console.log(decodedToken,"token décodé");
        const userId = decodedToken.userId; //on récupère le userId
        req.auth = {//création objet auth  avec un champ userID, dans objet req
            userId: userId //on rajoute cette valeur à l'objet req qui lui va être transmis aux routes utilisées par la suite
        };
        next();
    } catch (error) {
        res.status(401).json({error});

    }
};