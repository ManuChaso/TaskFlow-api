const userModel = require('../models/user');

async function getProfile(req, res){
    try{
        const email = req.user;

        const user = await userModel.findOne({email: email});


        if(user){
            res.status(200).send({
                message: 'User profile',
                success: true,
                profile: user
            });
        }else{
            res.status(404).send({
                message: 'Profile not found',
                success: false,
            })
        }
    } catch(err){
        console.error('Error getting project', err);
        res.status(500).send({
            message: 'Error getting project',
            success: false
        });
    }
}

module.exports = getProfile