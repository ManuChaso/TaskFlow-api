const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function Login(req, res){
    try{
        const data = req.body;

        const user = await userModel.findOne({email: data.email});

        if(user){
            if(user.verified){
                bcrypt.compare(data.password, user.password, (err, result) => {
                    if(err){
                        console.error('Error comparing password', err);
                    }else{
                        if(result){
                            const token = jwt.sign({email: user.email, password: user.password}, process.env.TOKEN_KEY, {expiresIn: '2w'});
        
                            res.status(200).send({
                                access: true,
                                token: token,
                                message: 'logged'
                            });
                        }else{
                            console.log('Incorrect password');
                            res.status(401).send({
                                message: 'Incorrect email or password',
                                access: false
                            });
                        }
                    }
                });
            }else{
                res.status(401).send({
                    message: 'Please verify your email',
                    access: false
                });
            }
        }else{
            res.status(404).send({
                message: 'User not found',
                access: false
            })
        }

    }catch(err){
        console.error('Error login');
        res.status(500).send({
            message: 'Server error, try again later',
            access: false
        })
    }
}

module.exports = Login