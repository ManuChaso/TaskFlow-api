const projectModel = require('../models/project');
const userModel = require('../models/user');

async function deleteUser(req, res){
    try{
        const email = req.user;

        const deletedUser = await userModel.findOneAndDelete({ email: email });

        if (!deletedUser) {
            return res.status(404).send({
                message: 'User not found',
                success: false
            });
        }

        console.log('User deleted', deletedUser);

        await projectModel.deleteMany({ owner: deletedUser._id });

        await projectModel.updateMany(
            { "members.id": deletedUser._id },
            { $pull: { members: { id: deletedUser._id } } }
        );

        res.status(200).send({
            message: 'User and associated projects deleted successfully',
            success: true
        });

    }catch(err){
        console.error('Error deleting user', err);
        res.status(500).send({
            message: 'Error deleting user',
            success: false
        });
    }
}   

module.exports = deleteUser;