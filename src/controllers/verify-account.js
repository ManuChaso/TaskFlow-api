const userModel = require('../models/user');
const jwt = require('jsonwebtoken');


async function verifyAccount(req, res){
    try{
        const data = req.body;

        const user = await userModel.findOne({email: data.email});

        console.log('Pass de la cuneta', user.password);
        console.log('pass recibida', data.password)

        if(user.password == decodeURIComponent(data.password)){
            const updatedUser = await userModel.findByIdAndUpdate(user._id, {verified: true}, {new: true});

            const token = jwt.sign({email: user.email, password: user.password}, process.env.TOKEN_KEY, {expiresIn: '2w'});

            console.log('Account verified: ', updatedUser);

            res.status(200).send({
                message: 'Account verified',
                access: true,
                token: token
            });
        }else{
            res.status(401).send({
                message: 'Unauthorized',
                access: false
            });
        }
    } catch(err) {
        console.error('Error verifying account', err);
        res.status(500).send({
            message: 'Server error, try again later',
            access: false
        });
    }
}

module.exports = verifyAccount