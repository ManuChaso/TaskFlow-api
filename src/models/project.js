const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: String,
    state: {
        type: String,
        enum: ['pending', 'urgent', 'progress', 'done'],
      },
})

const cardSchema = new Schema({
    name: String,
    tasks: [taskSchema],
    background: String,
    textColor: String
})

const memberSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String
})

const messageSchema = new Schema({
    owner: String,
    text: String
})

const projectSchema = new Schema({
    owner: String,
    name: String,
    description: String,
    members: [memberSchema],
    cards: [cardSchema],
    messages: [messageSchema]
});

const projectModel = mongoose.model('project', projectSchema);

module.exports = projectModel;