const projectModel = require('../models/project');
const userModel = require('../models/user');

async function getProjects(req, res){
    try{
        const email = req.user;
        
        const user = await userModel.findOne({email: email});

        const userProjects = await projectModel.find({ "members.id": user._id });

        res.status(200).send({
            message: 'User projects',
            success: true,
            projects: userProjects
        });

    } catch(err){
        console.error('Error getting project', err);
        res.status(500).send({
            message: 'Error getting project',
            success: false
        });
    }
}

module.exports = getProjects;