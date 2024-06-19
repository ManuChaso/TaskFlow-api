const projectModel = require('../models/project');
const userModel = require('../models/user');

async function createProject(req, res){
    try{
        const email = req.user;
        const data = req.body;

        const user = await userModel.findOne({email: email});

        const newProject = new projectModel({
            owner: user._id,
            name: data.name,
            description: data.description,
            members: [{id: user._id, name: user.userName}],
            cards: [],
        });

        const projectSaved = await newProject.save();
        res.status(201).send({
            message: 'Project created',
            success: true,
            project: projectSaved
        })
    } catch(err){
        console.error('Error creating project', err);
        res.status(500).send({
            message: 'Error creating project',
            success: false
        });
    }
}

module.exports = createProject;