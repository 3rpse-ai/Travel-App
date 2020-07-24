// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//fetch for making requests
const fetch = require("node-fetch");

//dotenv for saver storage of environment variables
const dotenv = require('dotenv');
dotenv.config();

//environment variables
const geoNamesUser = process.env.GEONAMES_USERNAME;

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('dist'))


// Setup Server
const port = 8000;
const server = app.listen(port,listening);

function listening(){
    console.log("server running");
    console.log(`running on localhost: ${port}`);
}

// Routes
app.get('/all', function(req, res){
    console.log("get called with: " + projectData);
    console.log(projectData);   
    res.send(projectData);
});

app.post('/send', function(req, res){
    let newData = req.body;
    let newEntry = {
        date: newData.date,
        temp: newData.temp,
        res: newData.res
    }
    console.log(newEntry);
    
    projectData = newEntry;
    console.log(projectData);
})

app.post('/receiveLocations', function(req, res){
    let newData = req.body;
    let newRequest = {
        location: newData.location,
        length: newData.length,
    }
    getWeatherData(getURL(newRequest.location,newRequest.length))
    .then(function(data){
        console.log("got quite far");
        console.log(data);
        res.send(data);
    })
})

const getWeatherData = async (url = '') =>{
    const res = await fetch(url);
    
    try{
        const data = await res.json();
        console.log("data received:");
        console.log(data);
        return data;
    } catch(error){
        console.log("error",error);
    }
}

function getURL(location, length){
    console.log('http://api.geonames.org/searchJSON?q='+location+'&maxRows='+length+'&username=3rpse');
    return 'http://api.geonames.org/searchJSON?q='+location+'&maxRows='+length+'&username=3rpse';
}


