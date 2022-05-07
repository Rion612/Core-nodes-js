const http = require('http');
const url = require('url');
const config = require('./config.json');
const HelperHandler = require('./helpers/helper')

const server  =  http.createServer(HelperHandler.handleReqRes);

server.listen(config.PORT,()=>{
    console.log(`Server is running at port ${config.PORT}`)
})