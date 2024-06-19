const projectModel = require('../models/project');
const userModel = require('../models/user');


async function importProject(req, res){
    try{    
        const email = req.user;
        const {name, description, cards} = req.body
        const user = await userModel.findOne({email: email});

        const newProject = new projectModel({
            name,
            description,
            cards,
            owner: user._id,
            members: [{id: user._id, name: user.userName}]
        });

        const savedProject = await newProject.save();

        res.status(201).send({
            message: 'Project imported',
            success: true,
            project: savedProject
        })

    } catch(err) {
        console.error('Error importing project: ', err);
        res.status(500).send({
            message: 'Error importing project. please, try again later',
            success: false
        })
    }
}

module.exports = importProject;