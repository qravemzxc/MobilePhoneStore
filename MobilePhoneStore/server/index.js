require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddlware')
const path = require('path')
const WebSocket = require('ws')
const https = require('https')
const fs = require('fs')

const PORT = process.env.PORT || 7000

const app = express()
const stripe = require('stripe')('sk_test_51PM8vcRpCtqCsl9Wwc6kApBsmU8uAklvbUepIgQzFTSnkZ3Tpv4U5Ui8Y6V9RPbY17DNIZxNRJfE2AUp9axIVF5N0000WHCNIp');
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(errorHandler)
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

const startHTTPSServer = () => {
    const options = {
        key: fs.readFileSync('./ca.key'),
        cert: fs.readFileSync('./ca.crt')
    };

    https.createServer(options, app).listen(process.env.PORT, () => {
        console.log(`Server running on https://localhost:${process.env.PORT}`);
    });
}

const startWebSocketServer = () => {
    const wss = new WebSocket.Server({ port: 4000, host: 'localhost', path: '/wsserver' })

    wss.on('connection', (ws) => {
        console.log('WebSocket client connected');
        
        ws.on('message', (message) => {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });
        
        ws.on('close', () => {
            console.log('WebSocket client disconnected');
        });
    });
}

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        startHTTPSServer()
        startWebSocketServer()
    }
    catch (e) {
        console.log(e)
    }
}

start()