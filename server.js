// "require" the Express module
const express = require('express');

// instantient the "app" object
const app = express(); 

//setup a port
const HTTP_PORT = process.env.PORT || 3000; // assign a port

//Get route for server
app.get('/',(req,res)=>
{
    res.send("Tina Srivastava - 103297230");
});

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));