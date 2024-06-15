const registerEmail = require('../emails/register-email');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

async function register(req, res){
    const data = req.body;
    const userExist = await userModel.findOne({email: data.email});

    if(!userExist){
        bcrypt.genSalt(10, (err, salt) => {
            if(err){
                console.error('Error generating salt', err);
            }else{
                bcrypt.hash(data.password, salt, (error, hash) => {
                    if(error){
                        console.log('Error hashing password', err);
                    }else{
                        const newUser = new userModel({
                            email: data.email,
                            userName: data.userName,
                            password: hash,
                            verified: false
                        });

                        newUser.save()
                            .then(userSaved => {
                                console.log('User saved', userSaved);
                                registerEmail(userSaved.email, userSaved.password)
                                res.status(201).send({
                                    message: 'User saved',
                                    access: true
                                });
                            })
                            .catch(err => {
                                console.error('Error saving user', err);
                                res.status(500).send({
                                    message: 'Server error, try again later',
                                    access: false
                                })
                            })
                    }
                })
            }
        })
    }else{
        res.status(409).send({
            message: 'User already exist',
            access: false
        });
    }

}

module.exports = register