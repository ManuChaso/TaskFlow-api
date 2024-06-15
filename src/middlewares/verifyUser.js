const jwt = require('jsonwebtoken');

function verifyUser(req, res, next){
    const token = req.headers.authorization;

    if(!token){
        res.status(401).send({
            message: 'Token not provided',
            access: false
        })
    }else{
        jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if(err){
                res.status(403).send({
                    message: 'Invalid token',
                    access: false
                })
            }else{
                req.user = decoded.email;
                next();
            }
        })
    }
}

module.exports = verifyUser