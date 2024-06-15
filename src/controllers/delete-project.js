const projectModel = require('../models/project');
const userModel = require('../models/user');

async function deleteProject(req, res){
    try{
        const email = req.user;
        const projectId = req.body.projectId;

        const user = await userModel.findOne({email: email});

        const project = await projectModel.findById(projectId);

        if(project.owner == user._id){
            const deletedProject = await projectModel.findByIdAndDelete(project._id);
            console.log('Project deleted', deleteProject);

            res.status(200).send({
                message: 'Project deleted successfully',
                success: true
            });
        }else{
            const updatedProject = await projectModel.findByIdAndUpdate(project._id, {$pull: {members: user._id}}, {new: true});

            console.log('Project updated', updatedProject);
            res.status(200).send({
                message: 'Project exit successfully',
                success: true
            });
        }

    } catch(err){
        console.error('Error deleting project', err);
        res.status(500).send({
            message: 'Error deleting project',
            success: false
        });
    }
}

module.exports = deleteProject