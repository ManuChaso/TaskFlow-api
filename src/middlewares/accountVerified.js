const userModel = require('../models/user');

async function accountVerified(req, res, next){
    try{
        const email = req.user;

        const user = await userModel.findOne({email: email});

        if(user.verified){
            next()
        }else{
            res.status(401).send({
                message: 'This action can only be done with a verified account.',
                access: false
            });
        }
    }catch(err){
        console.error('Error verifying account', err);
    }
}

module.exports = accountVerified;