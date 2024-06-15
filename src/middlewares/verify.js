function verify(req, res, next){
    const API_KEY = decodeURIComponent(req.headers['api_key']);

    if(API_KEY == process.env.API_KEY){
        next();
    }else{
        res.status(401).send({
            message: 'Unauthorized'
        })
    }
}

module.exports = verify