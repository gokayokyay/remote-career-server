require('dotenv').config();
const http = require("https");

const server = require('./src/server');

server.start();

setInterval(function() {
    http.get(process.env.APP_URL);
}, 300000); // every 5 minutes (300000)