const projectModel = require('../models/project');
const userModel = require('../models/user');

async function getProject(req, res){
    try{
        const email = req.user;
        const projectId = req.query.projectId;

        const user = await userModel.findOne({email: email});

        const userProject = await projectModel.findById(projectId);

        if(userProject.members.includes(user._id)){
            res.status(200).send({
                message: `Project: ${userProject.name}`,
                success: true,
                project: userProject
            })
        }else{
            res.status(401).send({
                message: 'Unauthorized',
                success: false
            });
        }

    } catch(err){
        console.error('Error getting project', err);
        res.status(500).send({
            message: 'Error getting project',
            success: false
        });
    }
}

module.exports = getProject;