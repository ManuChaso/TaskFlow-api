const verify = require('../middlewares/verify');
const Login = require('../controllers/login');
const Register = require('../controllers/register');
const verifyUser = require('../middlewares/verifyUser');
const deleteUser = require('../controllers/delete-user');
const createProject = require('../controllers/create-project');
const deleteProject = require('../controllers/delete-project');
const getProjects = require('../controllers/get-projects');
const getProject = require('../controllers/get-project');
const getProfile = require('../controllers/get-profile');
const accountVerified = require('../middlewares/accountVerified');
const verifyAccount = require('../controllers/verify-account');
const importProject = require('../controllers/import-project');


function routes(app){
    app.post('/register', verify, Register);
    app.post('/verify-account', verify, verifyAccount);
    app.post('/login', verify, Login);
    app.delete('/delete-account', verify, verifyUser, deleteUser);
    app.get('/get-profile', verify, verifyUser, getProfile);

    app.post('/create-project', verify, verifyUser, accountVerified, createProject);
    app.post('/import-project', verify, verifyUser, accountVerified, importProject)
    app.post('/delete-project', verify, verifyUser, accountVerified, deleteProject);

    app.get('/get-projects', verify, verifyUser, accountVerified, getProjects);
    app.get('/get-project', verify, verifyUser, accountVerified, getProject);
}

module.exports = routes;