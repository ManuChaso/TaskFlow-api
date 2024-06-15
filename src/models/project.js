const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    name: String
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

const projectSchema = new Schema({
    owner: String,
    name: String,
    description: String,
    members: [memberSchema],
    cards: [cardSchema],
});

const projectModel = mongoose.model('project', projectSchema);

module.exports = projectModel;