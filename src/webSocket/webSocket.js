const projectModel = require('../models/project');
const userModel = require('../models/user');

const connections = new Map()

const action = {
    sendMessage: (ws, client, message) => {
        if(connections.has(client)){
            const user = connections.get(client);

            connections.forEach((id, client) => {
                if(user == id){
                    client.send(JSON.stringify(message))
                }
            });
        }else{
            if(ws.clients.has(client)){
                client.send(JSON.stringify(message))
            }
        }
    },

    startSession: async (client, ws, data) => {
        try{
            connections.set(client, data.projectId);

            const project = await projectModel.findById(data.projectId);

            const response = { project: project }

            action.sendMessage(ws, client, response);
        } catch(err){
            console.log('Error setting session', err);
        }
    },

    createCard: async (client, ws, data) => {
        try{
            const card = data.card;         

            const projectUpdated = await projectModel.findByIdAndUpdate(connections.get(client), {$push: {cards: card}}, {new: true});

            const response = {project: projectUpdated}

            action.sendMessage(ws, client, response)
        } catch(err) {
            console.error('Error creating card', err);
        }
    },

    updateCard: async (client, ws, data) => {
        try{
            const cardId = data.cardId;
            const cardName = data.cardName;

            const projectUpdated = await projectModel.findOneAndUpdate({'cards._id': cardId}, {$set: {'cards.$.name': cardName}}, {new: true});

            const response = {
                project: projectUpdated
            }

            action.sendMessage(ws, client, response)
        } catch(err) {
            console.error('Error updating card', err);
        }
    },

    deleteCard: async (client, ws, data) => {
        try{
            const cardId = data.cardId;
            console.log(cardId)
            const projectUpdated = await projectModel.findByIdAndUpdate(connections.get(client), {$pull: {cards: {_id: cardId}}}, {new: true})
            console.log(projectUpdated)
            const response = {
                project: projectUpdated
            }

            action.sendMessage(ws, client, response)
        } catch(err) {
            console.error('Error updating card', err);
        }
    },

    editCardStyle: async (client, ws, data) => {
        try{
            const cardId = data.cardId;
            const colors = data.colors

            const projectUpdated = await projectModel.findOneAndUpdate(
                { 'cards._id': cardId },
                { $set: { 'cards.$.background': colors.background, 'cards.$.textColor': colors.textColor } },
                { new: true });

            const response = {
                project: projectUpdated
            }

            action.sendMessage(ws, client, response)
        } catch(err) {
            console.error('Error updating card', err);
        }
    },

    reorderCards: async (client, ws, data) => {
        try{
            const cards = data.cards;
            const projectId = data.projectId;

            const projectUpdated = await projectModel.findByIdAndUpdate(projectId, {$set: {cards: cards}}, {new: true});

            const response = {
                project: projectUpdated
            };
            action.sendMessage(ws, client, response);
        } catch(err) {
            console.log('Error reordering cards', err);
        }
    },

    createTask: async (client, ws, data) => {
        try{
            console.log('Tarea creada', data.task)
            const task = data.task;         
            const cardId = data.cardId;

            const projectUpdated =  await projectModel.findOneAndUpdate({'cards._id': cardId}, {$push: {'cards.$.tasks': task}}, {new: true});

            const response = {project: projectUpdated}

            action.sendMessage(ws, client, response)
        } catch(err) {
            console.error('Error creating card', err);
        }
    },

    changeTaskState: async (client, ws, data) => {
        try{
            const cardId = data.cardId;
            const taskId = data.taskId;
            const newState = data.newState;

            const projectUpdated = await projectModel.findByIdAndUpdate(
                connections.get(client),
                {
                    $set: { 'cards.$[cardElem].tasks.$[taskElem].state': newState }
                },
                {
                    arrayFilters: [
                        { 'cardElem._id': cardId },
                        { 'taskElem._id': taskId }
                    ],
                    new: true
                }
            );

            const response = {
                project: projectUpdated
            }

            action.sendMessage(ws, client, response);
        } catch(err) {
            console.error('Error updating task state', err);
        }
    },

    updateTask: async (client, ws, data) => {
        try{
            const cardId = data.cardId
            const taskId = data.taskId;
            const taskName = data.taskName;

            const projectUpdated = await projectModel.findByIdAndUpdate(
                connections.get(client),
                {
                    $set: { 'cards.$[cardElem].tasks.$[taskElem].name': taskName }
                },
                {
                    arrayFilters: [
                        { 'cardElem._id': cardId },
                        { 'taskElem._id': taskId }
                    ],
                    new: true
                }
            );

            const response = {
                project: projectUpdated
            }

            action.sendMessage(ws, client, response)
        } catch(err) {
            console.error('Error updating card', err);
        }
    },

    deleteTask: async (client, ws, data) => {
        try{
            const cardId = data.cardId;
            const taskId = data.taskId;

            const projectUpdated = await projectModel.findOneAndUpdate({_id: connections.get(client), 'cards._id': cardId}, {$pull: {'cards.$.tasks': {_id: taskId}}}, {new: true});

            const response = {
                project: projectUpdated
            };

            action.sendMessage(ws, client, response);
        } catch(err) {
            console.error('Error deleting task', err);
        }
    },

    reorderTasks: async (client, ws, data) => {
        try{
            const tasks = data.tasks;
            const cardId = data.cardId;

            const projectUpdated = await projectModel.findOneAndUpdate({_id: connections.get(client), 'cards._id': cardId}, {$set: {'cards.$.tasks': tasks}}, {new: true});

            const response = {
                project: projectUpdated
            }

            action.sendMessage(ws, client, response);
        } catch(err) {
            console.error('Error reordering tasks', err);
        }
    },

    transferTask: async (client, ws, data) => {
        try{
            const originCardId = data.originCard;
            const destinationCardId = data.destinationCard;
            const taskId = data.taskId;
            

            const project = await projectModel.findById(connections.get(client));
            if (!project) {
                throw new Error('Project not found');
            }
    
            const fromCard = project.cards.id(originCardId);
            const toCard = project.cards.id(destinationCardId);
            if (!fromCard || !toCard) {
                throw new Error('Card not found');
            }

            console.log(taskId)
            console.log(fromCard)
    
            const task = fromCard.tasks.id(taskId);
            if (!task) {
                throw new Error('Task not found in the source card');
            }
    
            // Convierte el task a un objeto simple
            const taskObject = task.toObject();
    
            // Elimina la tarea de la tarjeta origen
            fromCard.tasks.pull(taskId);
    
            // Agrega la tarea a la tarjeta destino
            toCard.tasks.push(taskObject);
    
            // Guarda los cambios
            await project.save();
    
            const response = {
                project
            };
    
            action.sendMessage(ws, client, response);
        } catch(err) {
            console.error('Error transferring task', err)
        }
    },

    addMember: async (client, ws, data) => {
        try{
            const projectId = data.projectId;
            const guestEmail = data.email;

            const guest = await userModel.findOne({email: guestEmail});

            if(guest){
                const project = await projectModel.findById(projectId);
                let exist = false;

                project.members.forEach(member => {
                    if(member.id.equals(guest._id)){
                        exist = true
                    }
                });

                if(!exist){
                    const projectUpdated = await projectModel.findByIdAndUpdate(projectId, {$push: {members: {name: guest.userName, id: guest._id}}}, {new: true});
                    const response = {
                        project: projectUpdated
                    }

                    action.sendMessage(ws, client, response);
                }
            }
        } catch(err) {
            console.error('Error adding member', err);
        }
    },

    deleteMember: async (client, ws, data) => {
        try{
            const projectId = data.projectId;
            const memberId = data.memberId;
            const member = data.id

            const project = await projectModel.findById(projectId);

            if(project.owner != member){
                const projectUpdated = await projectModel.findByIdAndUpdate(projectId, {$pull: {members: {_id: memberId}}}, {new: true});

                const response = {
                    project: projectUpdated
                }
    
                action.sendMessage(ws, client, response);
            }
        } catch(err) {
            console.error('Error deleting member', err);
        }
    },

    exit: (client) =>{
        connections.delete(client);
    }
}

module.exports = action