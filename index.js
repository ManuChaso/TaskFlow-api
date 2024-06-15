require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Server } = require('ws');

const connectDB = require('./src/database/database');
const routes = require('./src/routes/routes');
const action = require('./src/webSocket/webSocket');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

connectDB();
routes(app);

const server = app.listen(process.env.PORT, () => {
    console.log('Server listening on port: ', process.env.PORT)
});

const wss = new Server({ server: server });

wss.on('connection', (client) => {
    console.log('Cliente conectado');

    client.on('message', (message) => {
        const data = JSON.parse(message);
        
        if(action[data.action]){
            action[data.action](client, wss, data)
        }else{
            console.log('Invalid action')
        }
    });

    client.on('close', (client) => {
        console.log(client);
        console.log('Cliente desconectado');
        action.exit(client)
    })
})