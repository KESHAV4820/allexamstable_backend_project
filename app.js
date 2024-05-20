'use strict';


const express = require('express');
const app = express();

app.get('/', (request, response, next) => {	response.status(200).json({
    status:'success',
    message:'rest API is working'
})
});

server.listen( 3000, "", ()=>{
 console.log(" ---SERVER IS LISTENING--- ")});
